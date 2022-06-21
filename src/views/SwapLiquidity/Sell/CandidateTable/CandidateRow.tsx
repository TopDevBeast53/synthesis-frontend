import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import handleError from 'utils/handleError'
import { StyledRow, ButtonRow, AskingTokenCell, AddressCell, SkeletonCell } from 'views/SwapLiquidity/components/Cells/StyledCell'
import TokensCell from 'views/SwapLiquidity/components/Cells/TokensCell'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [bidData, setBidData] = useState<any>()
  const [pendingTx, setPendingTx] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const handleAcceptClick = (e) => {
    e.stopPropagation()
    setPendingTx(true)
    LpSwapContract.acceptBid(bidId)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success', 'Accepted!')
        setPendingTx(false)
      })
      .catch((err) => {
        handleError(err, toastError)
        setPendingTx(false)
      })
  }
  useEffect(() => {
    LpSwapContract.getBid(bidId).then((res) => {
      setBidData(res)
    })
  }, [LpSwapContract, bidId, swapData])
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
      <AddressCell style={{ paddingLeft: isMobile && 6, paddingRight: isMobile && 6 }}>
        <Text fontSize={isMobile ? "12px" : undefined}>{account === bidData?.bidder ? 'Me' : getEllipsis(bidData?.bidder)}</Text>
      </AddressCell>
      <AskingTokenCell style={{ paddingLeft: isMobile && 6, paddingRight: isMobile && 6 }}>
        <TokensCell token={swapData?.toSellerToken} balance={bidData?.amount.toString()} />
      </AskingTokenCell>
      <ButtonRow style={{ paddingLeft: isMobile && 6, paddingRight: isMobile && 6 }}>
        <Button
          variant="secondary"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          maxWidth="200px"
          style={{ zIndex: 20 }}
          onClick={handleAcceptClick}
        >
          Accept Bid
        </Button>
      </ButtonRow>
    </StyledRow>
  )
}

export default CandidateRow
