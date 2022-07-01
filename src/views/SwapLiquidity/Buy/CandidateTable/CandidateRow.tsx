import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'
import { StyledRow, ButtonRow, AskingTokenCell, AddressCell, SkeletonCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import { SwapState } from '../../types'
import DiscussOrder from '../Modals/DiscussOrder'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : null
}
const CandidateRow = ({ bidId, swapData, buyer }) => {
  const LpSwapContract = useHelixLpSwap()
  const { account } = useWeb3React()
  const { tableRefresh, setTableRefresh, filterState } = useContext(SwapLiquidityContext)
  const [bidData, setBidData] = useState<any>()
  const { isMobile } = useMatchBreakpoints()
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }
  const [showModal] = useModal(
    <DiscussOrder bidData={bidData} swapData={swapData} bidId={bidId} sendAsk={onSendAsk} buyer={buyer} />,
    false,
  )
  useEffect(() => {
    let unmounted = false;
    LpSwapContract.getBid(bidId).then((res) => {
      if (unmounted) return
      setBidData(res)
    })
    return () => {
      unmounted = true
    }
  }, [LpSwapContract, bidId])
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
        {filterState === SwapState.Applied && account === bidData?.bidder && (
          <Button variant="secondary" maxWidth="200px" style={{ zIndex: 20 }} scale={isMobile ? "sm" : "md"} onClick={showModal}>
            Update Bid
          </Button>
        )}
      </ButtonRow>
    </StyledRow>
  )
}

export default CandidateRow
