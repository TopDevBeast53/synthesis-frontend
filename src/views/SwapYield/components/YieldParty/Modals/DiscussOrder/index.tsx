import BigNumber from 'bignumber.js'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import {
  AutoRenewIcon,
  BalanceInput,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text
} from 'uikit'
import getThemeValue from 'uikit/util/getThemeValue'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
import handleError from 'utils/handleError'
import { useTokenDecimals, useTokenSymbol } from 'views/SwapYield/hooks/useTokenSymbol'

const DiscussOrder: React.FC<any> = ({onDismiss, onSend,  ...props}) => {
  const theme = useTheme()
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { swapId, swapData } = props
  const tokenSymbol = useTokenSymbol(swapData?.buyer)
  const decimals = useTokenDecimals(swapData?.buyer)  
  const [yAmount, setYAmount] = useState(getBalanceNumber(swapData?.ask.toString(), decimals).toString())

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleSendClick = () => {
    const decimalYAmount = getDecimalAmount(new BigNumber(yAmount), decimals)
    if (decimalYAmount.lte(BIG_ZERO)) {
      toastError('Error', 'Token Amount should be bigger than zero')
      return
    }
    setPendingTx(true)
    YieldSwapContract.setAsk(swapId, decimalYAmount.toString())
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success', 'Updated asking amount!')
        if (onSend) onSend()
        setPendingTx(false)
        onDismiss()
      })
      .catch((err) => {
        handleError(err, toastError)        
        setPendingTx(false)
      })
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading> Update Asking Amount </Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <Text style={{ marginRight: '1em' }}>{tokenSymbol}</Text>
            <BalanceInput value={yAmount} onUserInput={handleYAmountChange} />
          </div>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleSendClick}
            width="100%"
          >
            Confirm
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder
