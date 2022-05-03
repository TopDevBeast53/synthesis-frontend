import React, { useState, useCallback } from 'react'
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
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [isAllowed, setAllowed] = useState(1)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { bidData, bidId, swapData, onSend, onDismiss } = props
  const {data:farms} = useFarms()
  const lpToken = farms.find((item)=>(getAddress(item.lpAddresses) === swapData?.toBuyerToken))    
  const { userData } = useFarmFromLpSymbol(lpToken?.lpSymbol)

  const exContract = useERC20(swapData?.toSellerToken)

  const [yAmount, setYAmount] = useState(bidData?.amount.toString())
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
  const balanceYAmount = getBalanceAmount(new BigNumber(yAmount)).toString()
  const maxBalanceOfLP = getBalanceAmount(userData?.tokenBalance).toString()
  const handleSelectMaxOfLPToken = useCallback(() => {
    setYAmount(getDecimalAmount(new BigNumber(maxBalanceOfLP)))
  }, [maxBalanceOfLP, setYAmount])
  async function doValidation() {
    try {
      const allowedValue = userData?.allowance
      if (allowedValue.lte(decimalYAmount)) {
        toastError('Error', "You didn't allow the LPToken to use")
        setAllowed(0)
        setPendingTx(false)
        return false
      }
    } catch (err) {
      toastError('Error', err.toString())
      setAllowed(0)
      setPendingTx(false)
      return false
    }
    return true
  }

  const handleYAmountChange = (input) => {
    if ( Number.parseInt(input.target.value)  > Number.parseInt(maxBalanceOfLP)) {
      setYAmount(getDecimalAmount(new BigNumber(maxBalanceOfLP)))
    } else {
      console.debug('????', input.target.value)
      setYAmount(getDecimalAmount(new BigNumber(input.target.value || 0)))
    }
  }
  const handleAsk = async () => {
    setPendingTx(true)

    if (isAllowed === 0) {
      try {
        const tx = await exContract.approve(LpSwapContract.address, ethers.constants.MaxUint256)
        await tx.wait()
        setAllowed(yAmount)
        setPendingTx(false)
      } catch (err) {
        toastError('Error', err.toString())
        setPendingTx(false)
      }
      return
    }
    if (!(await doValidation())) return

    try {
      if (bidData) {
        const tx = await LpSwapContract.setBid(bidId, yAmount.toString())
        await tx.wait()
      } else {
        const tx = await LpSwapContract.makeBid(swapData?.id, yAmount.toString())
        await tx.wait()
      }
      if (onSend) onSend()
      setPendingTx(false)
      onDismiss()
      toastSuccess(`${t('Congratulations')}!`, t('You Make Bid !!! '))
    } catch (err) {
      setPendingTx(false)
      toastError('Error', err.toString())
    }
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>{getEllipsis(bidData?.bidder)}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <ModalInput
              value={balanceYAmount}
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
            width="100%"
          >
            {' '}
            {pendingTx ? (isAllowed === 0 ? 'Approving' : t('Confirming')) : isAllowed === 0 ? 'Approve' : t('Confirm')}
          </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder