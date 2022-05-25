import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Skeleton, Text, useMatchBreakpoints, useModal } from 'uikit'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell'
import TokensCell from 'views/SwapYield/components/Cells/TokensCell'
import { SwapState } from '../../types'
import DiscussOrder from '../Modals/DiscussOrder'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-wrap: wrap;
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
    <DiscussOrder bidData={bidData} swapData={swapData} bidId={bidId} sendAsk={onSendAsk} buyer={buyer}/>,
    false,
  )
  useEffect(() => {
    LpSwapContract.getBid(bidId).then((res) => {
      setBidData(res)
    })
  }, [LpSwapContract, bidId])
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
          <Text>{getEllipsis(bidData?.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>        
          <TokensCell token={swapData?.toSellerToken} balance={bidData?.amount.toString()} />
      </StyledCell>
      {filterState === SwapState.Applied && account === bidData?.bidder && (
        <StyledCell>
          <CellContent>
            <Button width="100px" style={{ zIndex: 20 }} scale={isMobile?"sm":"md"} onClick={showModal}>
              {' '}
              Update{' '}
            </Button>
          </CellContent>
        </StyledCell>
      )}
    </StyledRow>
  )
}

export default CandidateRow
