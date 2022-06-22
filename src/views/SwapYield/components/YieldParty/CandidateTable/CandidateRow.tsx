import { useWeb3React } from '@web3-react/core'
import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import TokenCell from '../../Cells/TokenCell'
import { StyledRow, AddressCell, ButtonRow, AskingTokenCell, SkeletonCell } from '../../Cells/StyledCell'
import AcceptBidModal from '../Modals/AcceptBidModal'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const YieldSwapContract = useHelixYieldSwap()
  const [bidData, setBidData] = useState<any>()
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const [showAcceptBidModal] = useModal(<AcceptBidModal bidId={bidId} swapData={swapData} bidData={bidData} />, false)
  const handleAcceptClick = (e) => {
    e.stopPropagation()
    showAcceptBidModal()
  }

  useEffect(() => {
    YieldSwapContract.getBid(bidId).then((res) => {
      setBidData(res)
    })
  }, [YieldSwapContract, bidId])
  if (!bidData) {
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
        <Text>{account === bidData?.bidder ? 'Me' : getEllipsis(bidData?.bidder)}</Text>
      </AddressCell>
      <AskingTokenCell>
        <TokenCell tokenInfo={swapData?.buyer} amount={bidData?.amount.toString()} />
      </AskingTokenCell>
      <ButtonRow>
        <Button
          variant="secondary"
          style={{ zIndex: 20 }}
          maxWidth="300px"
          scale={isMobile ? 'sm' : 'md'}
          onClick={handleAcceptClick}
        >
          Accept Bid
        </Button>
      </ButtonRow>
    </StyledRow>
  )
}

export default CandidateRow
