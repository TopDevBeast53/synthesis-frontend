import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHelixLpSwap } from 'hooks/useContract'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import styled from 'styled-components'
import { Button, Skeleton, Text, useModal } from 'uikit'
import BaseCell, { CellContent } from 'views/SwapYield/components/Cells/BaseCell'
import LPTokenCell from 'views/SwapYield/components/Cells/LPTokenCell'
import DiscussOrder from '../Modals/DiscussOrder'
import { SwapState } from '../../types'

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
const CandidateRow = ({ bidId, swapData }) => {
  const LpSwapContract = useHelixLpSwap()
  const { account } = useWeb3React()
  const { tableRefresh, setTableRefresh, filterState } = useContext(SwapLiquidityContext)
  const [bidData, setBidData] = useState<any>()
  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }
  const [showModal] = useModal(
    <DiscussOrder bidData={bidData} swapData={swapData} bidId={bidId} onSend={onSendAsk} />,
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
        <LPTokenCell lpTokenAddress={swapData?.toBuyerToken} balance={bidData?.amount.toString()} />
      </StyledCell>
      {filterState === SwapState.Applied && account === bidData?.bidder && (
        <StyledCell>
          <CellContent>
            <Button width="100px" style={{ zIndex: 20 }} onClick={showModal}>
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