import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { useAllTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarms } from 'state/farms/hooks'
import { AutoRenewIcon, Button, Text, Modal, ArrowDownIcon } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import handleError from 'utils/handleError'
import { ToolTipText } from 'views/SwapYield/constants'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import TokenCell from './TokenCell'
import { getTokenDecimals, getTokenSymbol } from './helpers'

const AcceptBidModal: React.FC<any> = ({ onDismiss, ...props }) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { bidId, swapData, bidData } = props
  const { data: farms } = useFarms()
  const tokens = useAllTokens()
  const { chainId } = useActiveWeb3React()

  const tooltipText = (swapData?.seller && swapData?.buyer) ?
    ToolTipText(
      getTokenSymbol(chainId, farms, tokens, swapData?.seller),
      getBalanceNumber(swapData?.seller.amount.toString(), getTokenDecimals(chainId, farms, tokens, swapData?.seller)).toString(),
      swapData?.seller.isLp,
      getTokenSymbol(chainId, farms, tokens, swapData?.buyer),
      getBalanceNumber(bidData?.amount.toString(), getTokenDecimals(chainId, farms, tokens, swapData?.buyer)).toString(),
      swapData?.buyer.isLp,
    )
    :
    ""
  const handleSendClick = () => {
    setPendingTx(true)
    YieldSwapContract.acceptBid(bidId)
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
            <TokenCell tokenInfo={swapData?.seller} amount={swapData?.seller.amount.toString()} />
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="18px" ml="10px">
              {getTokenSymbol(chainId, farms, tokens, swapData?.seller)}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <ArrowDownIcon width="16px" ml="8px" mt="8px" mb="8px" />
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap="0px">
            <TokenCell tokenInfo={swapData?.buyer} amount={bidData?.amount.toString()} />
          </RowFixed>
          <RowFixed gap="0px">
            <Text fontSize="18px" ml="10px">
              {getTokenSymbol(chainId, farms, tokens, swapData?.buyer)}
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
