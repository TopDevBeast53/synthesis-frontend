import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import IFOCreditCell from './Cells/IFOCreditCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'

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

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const isAuraPool = pool.sousId === 0

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell pool={pool} />
        {pool.vaultKey ? (
          ((isXLargerScreen && pool.vaultKey === VaultKey.IfoPool) || pool.vaultKey === VaultKey.HelixAutoPool) && (
            <AutoEarningsCell pool={pool} account={account} />
          )
        ) : (
          <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        )}
        {pool.vaultKey === VaultKey.IfoPool ? (
          <IFOCreditCell account={account} />
        ) : isXLargerScreen && isAuraPool ? (
          <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        ) : null}
        {isLargerScreen && !isAuraPool && <TotalStakedCell pool={pool} />}
        {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
        {isLargerScreen && isAuraPool && <TotalStakedCell pool={pool} />}
        {isDesktop && !isAuraPool && <EndsInCell pool={pool} />}
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

export default PoolRow
