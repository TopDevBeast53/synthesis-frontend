import { useWeb3React } from '@web3-react/core'
import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import handleError from 'utils/handleError'
import { YieldCPartyContext } from 'views/SwapYield/context'
import TokenCell from '../../Cells/TokenCell'
import BaseCell, { CellContent } from '../BaseCell'
import DiscussOrder from '../DiscussOrder'

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
const CandidateRow = ({ bidId, exToken, exAmount }) => {
  const { account } = useWeb3React()
  const { tableRefresh, setTableRefresh } = useContext(YieldCPartyContext)
  const YieldSwapContract = useHelixYieldSwap()
  const [bid, setBid] = useState<any>()
  const {isMobile} = useMatchBreakpoints()
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }

  useEffect(() => {
    let unmounted=false
    YieldSwapContract.bids(bidId).then((res) => {
      if (unmounted) return
      setBid(res)
    }).catch((err) => {
      handleError(err)      
    })
    return ()=>{
      unmounted=true
    } 
  })

  const [showModal] = useModal(
    <DiscussOrder bid={bid} onSend={onSendAsk} tokenInfo={exToken} amount={exAmount} bidId={bidId}/>,
    false,
  )
  if (!bid) {
    return (
      <StyledRow>
        <StyledCell>
          <CellContent>
            <Skeleton />
          </CellContent>
        </StyledCell>
        <StyledCell>
          <CellContent>
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
          <Text fontSize={isMobile ? "12px": undefined}>{account === bid?.bidder ? 'Me' : getEllipsis(bid?.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <TokenCell tokenInfo={exToken} amount={bid.amount.toString()} />
      </StyledCell>
      <StyledCell>
        <CellContent>
          {account === bid.bidder && (
            <Button 
              maxWidth="100px"
              scale = {isMobile ? 'sm' : 'md'} 
              style={{ zIndex: 20 }}
              onClick={showModal}>
              {' '}
              Update{' '}
            </Button>
          )}
        </CellContent>
      </StyledCell>
    </StyledRow>
  )
}

export default CandidateRow
