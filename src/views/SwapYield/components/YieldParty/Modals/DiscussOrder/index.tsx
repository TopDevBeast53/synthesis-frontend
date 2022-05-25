import BigNumber from 'bignumber.js'
import { useAllTokens } from 'hooks/Tokens'
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
  Text,
} from 'uikit'
import getThemeValue from 'uikit/util/getThemeValue'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'

const DiscussOrder: React.FC<any> = ({onDismiss, onSend,  ...props}) => {
  const theme = useTheme()
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { swapId, swapData } = props
  const tokens = useAllTokens()
  const exToken = tokens[swapData?.buyer.token]
  const [yAmount, setYAmount] = useState(getBalanceNumber(swapData?.ask.toString(), exToken.decimals).toString())

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleSendClick = () => {
    const decimalYAmount = getDecimalAmount(new BigNumber(yAmount), exToken.decimals)
    if (decimalYAmount.lte(BIG_ZERO)) {
      toastError('Error', 'Token Amount should be bigger than zero')
      return
    }
    setPendingTx(true)
    YieldSwapContract.setAsk(swapId, decimalYAmount.toString())
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success!', 'Amount is updated!')
        if (onSend) onSend()
        setPendingTx(false)
        onDismiss()
      })
      .catch((err) => {
        toastError('Error', err.toString())
        setPendingTx(false)
      })
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading> Update Asking</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <Text style={{ marginRight: '1em' }}>{exToken?.symbol}</Text>
            <BalanceInput value={yAmount} onUserInput={handleYAmountChange} />
          </div>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleSendClick}
            width="100%"
          >
            {' '}
            Send{' '}
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder

// const DiscussOrder = () => {
//     return (
//         <div style={{ padding: "32px", width: "500px" }}>
//             <Card>
//                 <CardHeader>
//                     <Heading size="xl">Card Header</Heading>
//                 </CardHeader>
//                 <CardBody>Body</CardBody>
//                 <CardFooter>Footer</CardFooter>
//             </Card>
//         </div>
//     )
// }
// export default DiscussOrder
