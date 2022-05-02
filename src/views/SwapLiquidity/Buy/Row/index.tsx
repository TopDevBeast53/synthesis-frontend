import React, { useContext } from 'react'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import ActiveRow from './ActiveRow'
import AppliedRow from './AppliedRow'
import FinishedRow from './FinishedRow'
import { SwapState } from '../../types'

const Row=({data})=>{    
    const {filterState} = useContext(SwapLiquidityContext)
    if (filterState === SwapState.All) return <ActiveRow swapData={data}/>
    if (filterState === SwapState.Applied) return <AppliedRow swapData={data}/>
    if (filterState === SwapState.Finished) return <FinishedRow swapData={data}/>
    return null
}

export default Row;