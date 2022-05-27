import { useWeb3React } from '@web3-react/core'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import handleError from 'utils/handleError'
import BaseCell, { CellContent } from '../../Cells/BaseCell'
import TokenCell from '../../Cells/TokenCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left: 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
    padding-left: 32px;
  }
`
const getEllipsis = (account) => {  
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bidId, swapData }) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [bidData, setBidData] = useState<any>()
  const [pendingTx, setPendingTx] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const {account} = useWeb3React()
  const handleAcceptClick = (e) => {
    e.stopPropagation()
    setPendingTx(true)
    YieldSwapContract.acceptBid(bidId)
      .then(async (tx) => {
        await tx.wait()
        toastSuccess('Success', 'You Accepted the Bid')
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
        <StyledCell>
          <CellContent>
            <Skeleton />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
            <Skeleton />
            <Skeleton mt="4px" />
          </CellContent>
        </StyledCell>
      </StyledRow>
    )
  }
  return (
    <StyledRow>
      <StyledCell>
        <CellContent>
          <Text>{account === bidData?.bidder ? 'Me' : getEllipsis(bidData?.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <TokenCell tokenInfo={swapData?.buyer} amount={bidData?.amount.toString()} />
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Button
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}            
            style={{ zIndex: 20 }}
            maxWidth="100px"
            scale = {isMobile ? 'sm' : 'md'}
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
