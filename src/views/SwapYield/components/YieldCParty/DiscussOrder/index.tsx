import React, { useState, useEffect, useCallback, useContext } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { ModalInput } from 'components/Modal'
import { useTheme } from 'styled-components'
import {
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  AutoRenewIcon,
} from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useHelixYieldSwap, useERC20 } from 'hooks/useContract'
import { BIG_ZERO } from 'utils/bigNumber'
import getThemeValue from 'uikit/util/getThemeValue'
import { YieldCPartyContext } from 'views/SwapYield/context'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import { SwapState } from '../../../types'

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { toastSuccess, toastError } = useToast()
  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const yieldSwapContract = useHelixYieldSwap()
  const { swapId, exToken, exAmount, onDismiss, bid, onSend } = props
  const { updateMenuIndex } = useContext(YieldCPartyContext)
  const exContract = useERC20(exToken)
  const exTokenAmount = exAmount.toString()
  const [pendingTx, setPendingTx] = useState(false)
  const [allowedValue, setAllowedValue] = useState(BIG_ZERO)
  const [maxBalance, setMaxBalance] = useState(BIG_ZERO)
  const [symbol, setSymbol] = useState('')
  const [yAmount, setYAmount] = useState('0')
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))

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
    exContract.allowance(account, yieldSwapContract.address).then((res) => {
      setAllowedValue(new BigNumber(res.toString()))
    })
    exContract.balanceOf(account).then((res) => {
      setMaxBalance(getBalanceAmount(new BigNumber(res.toString())))
    })

    exContract.symbol().then((res) => {
      setSymbol(res)
    })
  })

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
      toastError('Error', err.toString())
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
      exContract
        .approve(yieldSwapContract.address, ethers.constants.MaxUint256)
        .then(async (tx) => {
          await tx.wait()
          setAllowedValue(getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY)))
          setPendingTx(false)
        })
        .catch((err) => {
          if (err.message) {
            toastError('Error', err.message.toString())
          } else {
            toastError('Error', err.toString())
          }
          setPendingTx(false)
        })
      return
    }
    if (!(await doValidation())) return
    try {
      if (bid) {
        const tx = await yieldSwapContract.setBid(bid.id, decimalYAmount.toString())
        await tx.wait()
      } else {
        const tx = await yieldSwapContract.makeBid(swapId, decimalYAmount.toString())
        await tx.wait()
        updateMenuIndex(SwapState.Applied)
      }
      if (onSend) onSend()
      setPendingTx(false)
      onDismiss()
      if (bid) {
        toastSuccess(`${t('Success')}!`, t('Update success!'))
      } else {
        toastSuccess(`${t('Success')}!`, t('Bid added!'))
      }
    } catch (err) {
      setPendingTx(false)
      toastError('Error', err.toString())
    }
  }

  if (symbol === '') return null
  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>Seller is asking : {getBalanceAmount(exTokenAmount).toString()}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
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
