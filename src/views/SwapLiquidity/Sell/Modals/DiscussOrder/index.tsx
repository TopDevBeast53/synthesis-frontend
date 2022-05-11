import BigNumber from 'bignumber.js'
import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useTheme } from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
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
import { getAddress } from 'utils/addressHelpers'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const { swapId, onSend, onDismiss, swapData } = props
  const { data: farms } = useFarms()
  const toSellerToken = farms.find((item) => {
    return getAddress(item.lpAddresses) === swapData?.toSellerToken
  })
  const [yAmount, setYAmount] = useState(getBalanceNumber(swapData?.ask.toString()).toString())

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleSendClick = () => {
    const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
    if (decimalYAmount.lte(BIG_ZERO)) {
      toastError('Error', 'Token Amount should be bigger than zero')
      return
    }
    setPendingTx(true)
    LpSwapContract.setAsk(swapId, decimalYAmount.toString())
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
          <Heading> Update Asking </Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <Text style={{ marginRight: '1em' }}>{toSellerToken.lpSymbol}</Text>
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
