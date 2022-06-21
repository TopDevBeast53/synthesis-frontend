import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useAllTokens } from 'hooks/Tokens'
import { useERC20, useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMemoFarms } from 'state/farms/hooks'
import { useAllTokenBalances } from 'state/wallet/hooks'
import { useTheme } from 'styled-components'
import {
  AutoRenewIcon,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle
} from 'uikit'
import getThemeValue from 'uikit/util/getThemeValue'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import handleError from 'utils/handleError'

const DiscussOrder: React.FC<any> = ({onDismiss, ...props}) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { bidData, bidId, swapData, sendAsk, buyer } = props
  const allTokens = useAllTokens() // All Stable Token
  const allTokenBalances = useAllTokenBalances()  
  const { data: farms } = useMemoFarms()  
  const [allowedValue, setAllowedValue] = useState<BigNumber>()
  const [symbolName, buyerDecimals] = useMemo(()=>{    
    if(buyer.isLp){
      const lp = farms.find((item) => getAddress(item.lpAddresses) === buyer.token)      
      return lp ?  [lp.lpSymbol, lp.token.decimals] : ["", 18]
    }    
    return allTokens[buyer.token] ? [allTokens[buyer.token].symbol, allTokens[buyer.token].decimals] : ["", 18]
  },[allTokens, buyer, farms])

  const exContract = useERC20(swapData?.toSellerToken)
  const exContractAmount = bidData ? bidData?.amount.toString() : swapData?.ask.toString()

  const [yAmount, setYAmount] = useState(getBalanceAmount(exContractAmount, buyerDecimals).toString()) 
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount), buyerDecimals)

  const maxBalance = useMemo(()=>{
    if(buyer.isLp){
      const lp = farms.find((item) => getAddress(item.lpAddresses) === buyer.token)
      return lp ?  getBalanceAmount(lp.userData.tokenBalance, lp.token.decimals) : BIG_ZERO
    }
    
    return allTokenBalances[buyer.token] ? allTokenBalances[buyer.token].toExact() : BIG_ZERO

  }, [allTokenBalances, farms, buyer])  

  const handleSelectMaxOfLPToken = useCallback(() => {
    setYAmount(maxBalance.toString())
  }, [maxBalance, setYAmount])

  useEffect(() => {
    let unmounted=false;
    exContract.allowance(account, LpSwapContract.address).then((res) => {
      if (unmounted) return      
      setAllowedValue(new BigNumber(res.toString()))
    })
    return ()=>{
      unmounted=true
    }
  },[exContract, LpSwapContract, account])

  function doValidation() {
    if (allowedValue.lte(decimalYAmount)) {
      toastError('Error', "You didn't allow the LPToken to use")
      setPendingTx(false)
      return false
    }
    if ((new BigNumber(yAmount)).isGreaterThan(maxBalance)) {
      toastError('Error', "You don't have enough token balance")
      setPendingTx(false)
      return false
    }
    if (decimalYAmount.toString() === '0') {
      toastError('Error', 'Token amount should be bigger than zero')
      setPendingTx(false)
      return false
    }
    return true
  }

  const handleYAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        if (e.currentTarget.value === '') setYAmount('0')
        setYAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setYAmount],
  )
  const handleAsk = async () => {
    setPendingTx(true)

    if (allowedValue.lte(decimalYAmount)) {
      try {
        const tx = await exContract.approve(LpSwapContract.address, ethers.constants.MaxUint256)
        await tx.wait()
        setAllowedValue(getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), buyerDecimals))
        setPendingTx(false)
      } catch (err) {
        handleError(err, toastError)
        setPendingTx(false)
      }
      return
    }
    if (!doValidation()) return

    try {
      if (bidData) {
        const tx = await LpSwapContract.setBid(bidId, decimalYAmount.toString())
        await tx.wait()
      } else {
        const tx = await LpSwapContract.makeBid(swapData?.id, decimalYAmount.toString())
        await tx.wait()
      }
      if (sendAsk) sendAsk()
      setPendingTx(false)
      onDismiss()
      if (bidData) {
        toastSuccess(`${t('Success')}!`, t('Amount is updated!'))
      } else {
        toastSuccess(`${t('Success')}!`, t('Bid Successfully!'))
      }
    } catch (err) {
      setPendingTx(false)
      handleError(err, toastError)
    }
  }
  if (symbolName === '' || allowedValue === undefined) return null
  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>Asking : {getBalanceAmount(exContractAmount, buyerDecimals).toString()}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
          <ModalInput
            value={yAmount.toString()}
            onSelectMax={handleSelectMaxOfLPToken}
            onChange={handleYAmountChange}
            max={maxBalance.toString()}
            symbol={symbolName}
            addLiquidityUrl="#"
            inputTitle={t('Amount')}
          />
        </div>
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleAsk}
          mt="24px"
          width="100%"
        >
          {' '}
          {pendingTx
            ? allowedValue.lte(decimalYAmount)
              ? 'Approving'
              : t('Confirming')
            : allowedValue.lte(decimalYAmount)
            ? 'Approve'
            : t('Confirm')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder
