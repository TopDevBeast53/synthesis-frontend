import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Skeleton, Text } from 'uikit'
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-wrap:wrap;
    
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [bidData, setBidData] = useState<any>()
  const [pendingTx, setPendingTx] = useState(false)
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
        toastError('Error', err.toString())
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
        <StyledCell>
          <CellContent>
            <Skeleton />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <LPTokenCell />
        </StyledCell>
      </StyledRow>
    )
  }
  return (
    <StyledRow>
      <StyledCell>
        <CellContent>
          <Text>{getEllipsis(bidData?.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <LPTokenCell lpTokenAddress={swapData?.toSellerToken} balance={bidData?.amount.toString()} />
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            width="100px"
            style={{ zIndex: 20 }}
            onClick={handleAcceptClick}
          >
            {' '}
            Accept{' '}
          </Button>
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default CandidateRow
