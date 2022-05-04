import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap, useERC20 } from 'hooks/useContract'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import useToast from 'hooks/useToast'
import { ModalInput } from 'components/Modal'
import { getAddress } from 'utils/addressHelpers'
import { useFarms, useFarmFromLpSymbol } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { useTheme } from 'styled-components'
import {
  AutoRenewIcon,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
} from 'uikit'
import getThemeValue from 'uikit/util/getThemeValue'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const {account} = useWeb3React()
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { bidData, bidId, swapData, onSend, onDismiss } = props
  const {data:farms} = useFarms()
  const lpToken = farms.find((item)=>(getAddress(item.lpAddresses) === swapData?.toSellerToken))    
  const { userData } = useFarmFromLpSymbol(lpToken?.lpSymbol)
  const [allowedValue, setAllowedValue] = useState(BIG_ZERO)

  const exContract = useERC20(swapData?.toSellerToken)
  const exContractAmount = bidData ? bidData?.amount.toString() : swapData?.ask.toString()
  
  const [yAmount, setYAmount] = useState(getBalanceAmount(exContractAmount).toString())
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
  const balanceYAmount = getBalanceAmount(new BigNumber(yAmount))
  const maxBalanceOfLP = getBalanceAmount(userData?.tokenBalance).toString()
  
  const handleSelectMaxOfLPToken = useCallback(() => {
    setYAmount(maxBalanceOfLP.toString())
  }, [maxBalanceOfLP, setYAmount])
  
  useEffect(() => {
    exContract.allowance(account, LpSwapContract.address).then((res) => {
      setAllowedValue(new BigNumber(res.toString()))
    })
  })
  
  function doValidation() {
    if (allowedValue.lte(decimalYAmount)) {
      toastError('Error', "You didn't allow the LPToken to use")
      setPendingTx(false)
      return false
    }
    if(balanceYAmount.isGreaterThan(maxBalanceOfLP)) {
      toastError('Error', "You don't have enough token balance")
      setPendingTx(false)
      return false
    }
    if(decimalYAmount.toString() === '0') {
      toastError('Error', "Token amount should be bigger than zero")
      setPendingTx(false);        
      return false  
    }
    return true
  }

  const handleYAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        if (e.currentTarget.value === "")
          setYAmount("0")
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
        setAllowedValue(getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY)))
        setPendingTx(false)
      } catch (err) {
        toastError('Error', err.toString())
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
      if (onSend) onSend()
      setPendingTx(false)
      onDismiss()
      if(bidData) {
        toastSuccess(`${t('Success')}!`, t('Update Success!'))
      } else {
        toastSuccess(`${t('Success')}!`, t('Bid Success!'))
      }
    } catch (err) {
      setPendingTx(false)
      toastError('Error', err.toString())
    }
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>Asking : {getBalanceAmount(exContractAmount).toString()}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <ModalInput
              value={yAmount.toString()}
              onSelectMax={handleSelectMaxOfLPToken}
              onChange={handleYAmountChange}
              max={maxBalanceOfLP}
              symbol={lpToken?.lpSymbol}
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
            {pendingTx ? allowedValue.lte(decimalYAmount) ? "Approving" :t('Confirming') : allowedValue.lte(decimalYAmount)? "Approve" : t('Confirm')}
          </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder