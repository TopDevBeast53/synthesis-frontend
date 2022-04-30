import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon } from 'uikit'
import { YieldPartyContext } from 'views/SwapYield/context'
import { OrderState } from 'views/SwapYield/types'
import ActiveRow from './ActiveRow'
import BaseCell from '../../Cells/BaseCell'
import EarnedRow from './EarnedRow'

const StyledRow = styled.div`
  background-color: transparent;
  
  display: flex;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const YieldPartyRow=({data: swapId})=>{
    const YieldSwapContract = useHelixYieldSwap()
    const {filterState} = useContext(YieldPartyContext)
    const [swapData, setSwapData] = useState<any>()    
    useEffect(()=>{        
        YieldSwapContract.getSwap(swapId).then(swap=>{
            setSwapData(swap)            
        })
    }, [YieldSwapContract, swapId])

    
    if(filterState === OrderState.Active )  return <ActiveRow swapData={swapData} swapId={swapId}/>
    if(filterState === OrderState.Completed) return <EarnedRow swapData={swapData}/>
    return null

}

export default YieldPartyRow;