import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import Harvest from './Collect'
import Stake from './Stake'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`
interface ActionPanelProps {
  expanded: boolean
  earnings
  isLoading
  deposit
  stakedBalance
  updateEarnings?
  updateStake?
  updateStakedBalance?
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  expanded,
  earnings,
  isLoading,
  deposit,
  stakedBalance,
  updateEarnings,
  updateStake,
  updateStakedBalance,
}) => {
  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        <Harvest isLoading={isLoading} earnings={earnings} deposit={deposit} updateEarnings={updateEarnings} updateStakedBalance={updateStakedBalance} />
        <Stake isLoading={isLoading} deposit={deposit} stakedBalance={stakedBalance} updateStake={updateStake} />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
