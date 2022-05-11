import { useHelixLpSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { OrderState } from 'views/SwapYield/types'
import ActiveRow from './ActiveRow'
import EarnedRow from './EarnedRow'

const Row = ({ data: swapId }) => {
  const LpSwapContract = useHelixLpSwap()
  const { filterState } = useContext(SwapLiquidityContext)
  const [swapData, setSwapData] = useState<any>()
  useEffect(() => {
    LpSwapContract.getSwap(swapId).then((swap) => {
      setSwapData(swap)
    })
  }, [LpSwapContract, swapId])

  if (filterState === OrderState.Completed) return <EarnedRow swapData={swapData} />
  return <ActiveRow swapData={swapData} swapId={swapId} />
}

export default Row
