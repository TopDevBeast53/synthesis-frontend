import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import React, { useEffect, useState, useMemo } from 'react'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import { useAllTokens } from 'hooks/Tokens'
import { StyledRow, ButtonRow, AskingTokenCell, AddressCell, SkeletonCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'
import AcceptBidModal from '../Modals/AcceptBidModal'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const LpSwapContract = useHelixLpSwap()
  const [bidData, setBidData] = useState<any>()
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const tokens = useAllTokens()

  const buyer = useMemo(() => {
    if (!swapData) return undefined
    if (tokens[swapData.toSellerToken])
      return { token: swapData.toSellerToken, isLp: false }
    return { token: swapData.toSellerToken, isLp: true }
  }, [swapData, tokens])

  const seller = useMemo(() => {
    if (!swapData) return undefined
    if (tokens[swapData.toBuyerToken])
      return { token: swapData.toBuyerToken, isLp: false, amount: swapData.amount }
    return { token: swapData.toBuyerToken, isLp: true, amount: swapData.amount }
  }, [swapData, tokens])

  useEffect(() => {
    LpSwapContract.getBid(bidId).then((res) => {
      setBidData(res)
    })
  }, [LpSwapContract, bidId, swapData])

  const [showAcceptBidModal] = useModal(<AcceptBidModal bidId={bidId} swapData={swapData} seller={seller} buyer={buyer} bidData={bidData} />, false)
  const handleAcceptClick = (e) => {
    e.stopPropagation()
    showAcceptBidModal()
  }

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
        <Text fontSize={isMobile ? "12px" : undefined}>{account === bidData?.bidder ? 'Me' : getEllipsis(bidData?.bidder)}</Text>
      </AddressCell>
      <AskingTokenCell>
        <TokensCell token={swapData?.toSellerToken} balance={bidData?.amount.toString()} />
      </AskingTokenCell>
      <ButtonRow>
        <Button
          variant="secondary"
          maxWidth="300px"
          style={{ zIndex: 20 }}
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
