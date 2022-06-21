import { useWeb3React } from '@web3-react/core'
import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import handleError from 'utils/handleError'
import { YieldCPartyContext } from 'views/SwapYield/context'
import TokenCell from '../../Cells/TokenCell'
import { StyledRow, AddressCell, ButtonRow, AskingTokenCell, SkeletonCell } from '../../Cells/StyledCell'
import DiscussOrder from '../DiscussOrder'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, exToken, exAmount }) => {
  const { account } = useWeb3React()
  const { tableRefresh, setTableRefresh } = useContext(YieldCPartyContext)
  const YieldSwapContract = useHelixYieldSwap()
  const [bid, setBid] = useState<any>()
  const { isMobile } = useMatchBreakpoints()
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }

  useEffect(() => {
    let unmounted = false
    YieldSwapContract.bids(bidId).then((res) => {
      if (unmounted) return
      setBid(res)
    }).catch((err) => {
      handleError(err)
    })
    return () => {
      unmounted = true
    }
  })

  const [showModal] = useModal(
    <DiscussOrder bid={bid} onSend={onSendAsk} tokenInfo={exToken} amount={exAmount} bidId={bidId} />,
    false,
  )
  if (!bid) {
    return (
      <StyledRow>
        <SkeletonCell>
          <Skeleton />
        </SkeletonCell>
        <SkeletonCell>
          <Skeleton />
        </SkeletonCell>
      </StyledRow>
    )
  }
  return (
    <StyledRow>
      <AddressCell>
        <Text fontSize={isMobile ? "12px" : undefined}>{account === bid?.bidder ? 'Me' : getEllipsis(bid?.bidder)}</Text>
      </AddressCell>
      <AskingTokenCell>
        <TokenCell tokenInfo={exToken} amount={bid.amount.toString()} />
      </AskingTokenCell>
      <ButtonRow>
        {account === bid.bidder && (
          <Button
            variant="secondary"
            maxWidth="200px"
            scale={isMobile ? 'sm' : 'md'}
            style={{ zIndex: 20 }}
            onClick={showModal}>
            Update Ask
          </Button>
        )}
      </ButtonRow>
    </StyledRow>
  )
}

export default CandidateRow
