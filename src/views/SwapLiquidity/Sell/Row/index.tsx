import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { OrderState } from 'views/SwapYield/types'
import ActiveRow from './ActiveRow'
import EarnedRow from './EarnedRow'

const Row=({data: swapId})=>{
    const YieldSwapContract = useHelixYieldSwap()
    const {filterState} = useContext(SwapLiquidityContext)
    const [swapData, setSwapData] = useState<any>()    
    useEffect(()=>{        
        YieldSwapContract.getSwap(swapId).then(swap=>{
            setSwapData(swap)            
        })
    }, [YieldSwapContract, swapId])

    
    
    if(filterState === OrderState.Completed) return <EarnedRow swapData={swapData}/>
    return <ActiveRow swapData={swapData} swapId={swapId}/>

}

export default Row;