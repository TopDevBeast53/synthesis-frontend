import { useWeb3React } from '@web3-react/core'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { Button, Skeleton, Text, useModal } from 'uikit'
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
  padding-left: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null
}
const CandidateRow = ({ bid, exToken, exAmount }) => {
  const { account } = useWeb3React()
  const { tableRefresh, setTableRefresh } = useContext(YieldCPartyContext)

  const onSendAsk = () => {
    setTableRefresh(tableRefresh + 1)
  }

  const [showModal] = useModal(
    <DiscussOrder bid={bid} onSend={onSendAsk} tokenInfo={exToken} amount={exAmount} />,
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
            <Text>DAmount</Text>
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
          <Text>{getEllipsis(bid.bidder)}</Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <TokenCell tokenInfo={exToken} amount={exAmount.toString()} />
      </StyledCell>
      <StyledCell>
        <CellContent>
          {account === bid.bidder && (
            <Button width="100px" style={{ zIndex: 20 }} onClick={showModal}>
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
