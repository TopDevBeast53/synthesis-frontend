import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import {
  BalanceInput,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text,
} from 'uikit'
import { useHelixYieldSwap } from 'hooks/useContract'
import getThemeValue from 'uikit/util/getThemeValue'

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const yieldSwapContract = useHelixYieldSwap()
  const { opponentAddress, onDismiss } = props

  const [yAmount, setYAmount] = useState(0.0)

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }

  const handleAsk = async () => {
    const res = await yieldSwapContract.makeBid(0, yAmount)
    console.debug(res)
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>A</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <Text style={{ marginRight: '1em' }}>Y Amount</Text>
            <BalanceInput value={yAmount} onUserInput={handleYAmountChange} />
          </div>
          <Button width="100%" onClick={handleAsk}>
            Send
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder
