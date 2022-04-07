import useDelayedUnmount from 'hooks/useDelayedUnmount'
import React, { useState } from 'react'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import ActionPanel from './ActionPanel/ActionPanel'
import EarningsCell from './Cells/EarningsCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import StakedCell from './Cells/StakedCell'
import WithdrawTimeLeft from './Cells/WithdrawTimeLeft'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const VaultRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }


  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
      <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
      <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
      <WithdrawTimeLeft pool={pool}/>
      <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      )}
    </>
  )
}

export default VaultRow
