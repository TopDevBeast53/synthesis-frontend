import { useWeb3React } from '@web3-react/core'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import handleError from 'utils/handleError'
import TokenCell from '../../Cells/TokenCell'
import { StyledRow, AddressCell, ButtonRow, AskingTokenCell, SkeletonCell } from '../../Cells/StyledCell'

const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [bidData, setBidData] = useState<any>()
  const [pendingTx, setPendingTx] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const handleAcceptClick = (e) => {
    e.stopPropagation()
    setPendingTx(true)
    YieldSwapContract.acceptBid(bidId)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success', 'Accepted the Bid')
        setPendingTx(false)
      })
      .catch((err) => {
        handleError(err, toastError)
        setPendingTx(false)
      })
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
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
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
