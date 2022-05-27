import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import handleError from 'utils/handleError'
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'

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
        <StyledCell>
          <CellContent>
            <Skeleton />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <Skeleton />
        </StyledCell>
      </StyledRow>
    )
  }
  return (
    <StyledRow>
      <StyledCell>
        <CellContent>
        <Text fontSize={isMobile ? "12px": undefined}>{account === bidData?.bidder ? 'Me' : getEllipsis(bidData?.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <TokensCell token={swapData?.toSellerToken} balance={bidData?.amount.toString()} />        
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
