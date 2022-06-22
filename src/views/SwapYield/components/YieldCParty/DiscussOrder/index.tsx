import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useERC20, useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import {
  AutoRenewIcon, Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle
} from 'uikit'
import getThemeValue from 'uikit/util/getThemeValue'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import handleError from 'utils/handleError'
import { useTokenDecimals, useTokenSymbol } from 'views/SwapYield/hooks/useTokenSymbol'

const DiscussOrder: React.FC<any> = ({onDismiss, onSend, ...props}) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { toastSuccess, toastError } = useToast()
  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const yieldSwapContract = useHelixYieldSwap()
  const { swapId, tokenInfo, amount, bid, bidId } = props
  const tokenAddress = tokenInfo.token
  const symbol = useTokenSymbol(tokenInfo)
  const decimals = useTokenDecimals(tokenInfo)
  const erc20Contract = useERC20(tokenAddress)
  const exTokenAmount = bid ? bid?.amount.toString() : amount.toString()
  const [pendingTx, setPendingTx] = useState(false)
  const [allowedValue, setAllowedValue] = useState<BigNumber>()
  const [maxBalance, setMaxBalance] = useState(BIG_ZERO)
  const [yAmount, setYAmount] = useState(getBalanceAmount(exTokenAmount, decimals).toString())
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount), decimals)

  const handleYAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        if (e.currentTarget.value === '') setYAmount('0')
        setYAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setYAmount],
  )
  
  useEffect(() => {
    let unmounted=false
    erc20Contract.allowance(account, yieldSwapContract.address).then((res) => {
      if(unmounted) return
      setAllowedValue(new BigNumber(res.toString()))
    })
    erc20Contract.balanceOf(account).then((res) => {      
      if (unmounted) return
      setMaxBalance(getBalanceAmount(new BigNumber(res.toString()), decimals))
    })
    // erc20Contract.symbol().then((res) => {
    //   setSymbol(res)
    // })
    return ()=>{
      unmounted=true
    }  
  },[erc20Contract, account, yieldSwapContract.address, decimals])

  const handleSelectMaxOfToken = useCallback(() => {
    setYAmount(maxBalance.toString())
  }, [maxBalance, setYAmount])

  async function doValidation() {
    try {
      if (allowedValue.lte(decimalYAmount.toString())) {
        toastError('Error', "You didn't allow the LPToken to use")
        setPendingTx(false)
        return false
      }
    } catch (err) {
      handleError(err, toastError)
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

  const handleAsk = async () => {
    setPendingTx(true)    
    if (allowedValue.lte(decimalYAmount.toString())) {
      erc20Contract
        .approve(yieldSwapContract.address, ethers.constants.MaxUint256)
        .then(async (tx) => {
          await tx.wait()
          setAllowedValue(getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), decimals))
          setPendingTx(false)
        })
        .catch((err) => {
          handleError(err, toastError)          
          setPendingTx(false)
        })
      return
    }
    if (!(await doValidation())) return
    try {
      if(bid){
        const tx = await yieldSwapContract.setBid(bidId, decimalYAmount.toString())
        await tx.wait()
        if (onSend) onSend()
        setPendingTx(false);   
        onDismiss()
        toastSuccess(`${t('Success')}!`, t('Updated bid amount!'))
      } else {
        const tx = await yieldSwapContract.makeBid(swapId, decimalYAmount.toString())
        await tx.wait()
        if (onSend) onSend()
        setPendingTx(false);   
        onDismiss()
        toastSuccess(`${t('Success')}!`, t('Bid successfully! Please check in My Bids.'))
      }
    } catch (err) {
      setPendingTx(false)
      handleError(err, toastError)      
    }
  }

  if (symbol === '' || allowedValue === undefined) return null
  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>Asking Amount: {getBalanceAmount(amount.toString(), decimals).toString()}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center'}}>
          <ModalInput
            value={yAmount.toString()}
            onSelectMax={handleSelectMaxOfToken}
            onChange={handleYAmountChange}
            max={maxBalance.toString()}
            symbol={symbol}
            addLiquidityUrl="#"
            inputTitle={t('Amount')}
          />
        </div>
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="24px"
          width="100%"
          onClick={handleAsk}
        >
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
