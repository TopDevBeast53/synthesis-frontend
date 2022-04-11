import BigNumber from 'bignumber.js'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { logError } from 'utils/sentry'
import { useHelixLockVault } from 'views/Vault/hooks/useHelixLockVault'
import ActionPanel from './ActionPanel/ActionPanel'
import EarningsCell from './Cells/EarningsCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import StakedCell from './Cells/StakedCell'
import WithdrawTimeLeft from './Cells/WithdrawTimeLeft'


interface PoolRowProps {  
  deposit?
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const VaultRow: React.FC<PoolRowProps> = ({ deposit }) => {
  const { isTablet, isDesktop } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const [isLoading, setLoading]= useState(true)
  const [earnings, setEarnings] = useState(BIG_ZERO)
  const [stakedBalance, setStakedBalance] = useState(deposit?.amount?deposit.amount:BIG_ZERO)
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  
  const {getPendingRewardFromId} = useHelixLockVault()

  useEffect(() => {
    load()
    async function load(){
      const result = await getPendingRewardFromId(deposit?.id)
      setLoading(false)
      setEarnings(new BigNumber(result))
    }
  }, [deposit, getPendingRewardFromId])

  const  updateEarnings=(value)=>{
    setEarnings(new BigNumber(value))
  }
  const updateStake=(newStaked)  => {        
    setStakedBalance(newStaked)
    getPendingRewardFromId(deposit?.id).then((value)=>{
      setEarnings(new BigNumber(value))
    }).catch(err=>{
      logError(err)
    })    
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
      <EarningsCell isLoading={isLoading} earnings={earnings}/>
      <StakedCell stakedBalance={stakedBalance}/>
      <WithdrawTimeLeft deposit={deposit} />
      <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel 
          earnings={earnings}
          isLoading={isLoading}                    
          expanded={expanded}
          deposit = {deposit}          
          stakedBalance={stakedBalance}
          updateEarnings={updateEarnings}
          updateStake={updateStake}
          
        />
      )}
    </>
  )
}

export default VaultRow
