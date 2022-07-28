import BigNumber from 'bignumber.js'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { logError } from 'utils/sentry'
import getTokens from 'config/constants/tokens'
import { useHelixVault } from 'hooks/useContract'
import { CurrencyLogo } from 'components/Logo'
import ActionPanel from './ActionPanel/ActionPanel'
import EarningsCell from './Cells/EarningsCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import StakedCell from './Cells/StakedCell'
import WithdrawTimeLeft from './Cells/WithdrawTimeLeft'
import AprCell from './Cells/AprCell'

interface PoolRowProps {
  deposit: any
}

const Container = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const VaultRow: React.FC<PoolRowProps> = ({ deposit }) => {
  const { isTablet, isDesktop } = useMatchBreakpoints()
  const helixVaultContract = useHelixVault()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const [isLoading, setLoading] = useState(true)
  const [earnings, setEarnings] = useState(BIG_ZERO)
  const [stakedBalance, setStakedBalance] = useState<BigNumber>(deposit?.amount ? deposit.amount : BIG_ZERO)
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  useEffect(() => {
    load()
    async function load() {
      const result = await helixVaultContract.pendingReward(deposit?.id)
      setLoading(false)
      setEarnings(new BigNumber(result.toString()))
    }
  }, [helixVaultContract, deposit])

  const updateEarnings = (value) => {
    setEarnings(new BigNumber(value))
  }

  const updateStakedBalance = () => {
    helixVaultContract.deposits(deposit?.id)
      .then((value) => {
        setStakedBalance(new BigNumber(value.amount.toString()))
      })
      .catch((err) => {
        logError(err)
      })
  }

  const updateStake = (newStaked) => {
    setStakedBalance(newStaked)
    helixVaultContract.pendingReward(deposit?.id)
      .then((value) => {
        setEarnings(new BigNumber(value.toString()))
      })
      .catch((err) => {
        logError(err)
      })
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        {(isTablet || isDesktop) && (
          <>
            <Container>
              <CurrencyLogo currency={getTokens.helix} size="36px" />
            </Container>
            <StakedCell stakedBalance={stakedBalance} />
          </>
        )}
        <Container>
          <CurrencyLogo currency={getTokens.helix} size="36px" />
        </Container>
        <EarningsCell isLoading={isLoading} earnings={earnings} />
        <AprCell stakedBalance={stakedBalance} apr={deposit.apr} />
        <WithdrawTimeLeft deposit={deposit} />
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          earnings={earnings}
          isLoading={isLoading}
          expanded={expanded}
          deposit={deposit}
          stakedBalance={stakedBalance}
          updateEarnings={updateEarnings}
          updateStake={updateStake}
          updateStakedBalance={updateStakedBalance}
        />
      )}
    </>
  )
}

export default VaultRow
