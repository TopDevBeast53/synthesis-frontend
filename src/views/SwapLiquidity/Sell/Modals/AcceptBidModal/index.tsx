import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { useAllTokens } from 'hooks/Tokens'
import { useFarms } from 'state/farms/hooks'
import { AutoRenewIcon, Button, Text, Modal, ArrowDownIcon } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import handleError from 'utils/handleError'
import { ToolTipText } from 'views/SwapLiquidity/constants'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import TokensCell from './TokensCell'
import { getTokenDecimals, getTokenSymbol } from './helpers'

const AcceptBidModal: React.FC<any> = ({ onDismiss, ...props }) => {
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { bidId, swapData, seller, buyer, bidData } = props
  const { data: farms } = useFarms()
  const tokens = useAllTokens()

  const tooltipText = (seller && buyer) ?
    ToolTipText(
      getTokenSymbol(farms, tokens, seller),
      getBalanceNumber(seller?.amount.toString(), getTokenDecimals(farms, tokens, seller)).toString(),
      seller.isLp,
      getTokenSymbol(farms, tokens, buyer),
      getBalanceNumber(bidData?.amount.toString(), getTokenDecimals(farms, tokens, buyer)).toString(),
      buyer.isLp,
    )
    :
    ""
  const handleSendClick = () => {
    setPendingTx(true)
    LpSwapContract.acceptBid(bidId)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success', 'Accepted the Bid!')
        setPendingTx(false)
        onDismiss()
      })
      .catch((err) => {
        handleError(err, toastError)
        setPendingTx(false)
      })
  }

  return (
    <Modal title="Accept Bid" onDismiss={onDismiss} style={{ maxWidth: "30%" }} >
      <AutoColumn gap="md">
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <TokensCell token={swapData?.toBuyerToken} balance={swapData?.amount.toString()} />
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="18px" ml="10px">
              {getTokenSymbol(farms, tokens, seller)}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <ArrowDownIcon width="16px" ml="8px" mt="8px" mb="8px" />
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <TokensCell token={swapData?.toSellerToken} balance={bidData?.amount.toString()} />
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="18px" ml="10px">
              {getTokenSymbol(farms, tokens, buyer)}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <Text fontSize="14px" mt="16px">{tooltipText}</Text>
        </RowFixed>

        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleSendClick}
          width="100%"
          mt="8px"
        >
          Confirm
        </Button>
      </AutoColumn>
    </Modal>
  )
}

export default AcceptBidModal
