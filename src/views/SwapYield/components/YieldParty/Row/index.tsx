import { useHelixYieldSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useState } from 'react'
import { YieldPartyContext } from 'views/SwapYield/context'
import { OrderState } from 'views/SwapYield/types'
import ActiveRow from './ActiveRow'
import EarnedRow from './EarnedRow'

const YieldPartyRow = ({ data: swapId }) => {
  const YieldSwapContract = useHelixYieldSwap()
  const { filterState } = useContext(YieldPartyContext)
  const [swapData, setSwapData] = useState<any>()
  useEffect(() => {
    YieldSwapContract.getSwap(swapId).then((swap) => {
      setSwapData(swap)
    })
  }, [YieldSwapContract, swapId])

  if (filterState === OrderState.Active) return <ActiveRow swapData={swapData} swapId={swapId} />
  if (filterState === OrderState.Completed) return <EarnedRow swapData={swapData} swapId={swapId} />
  return null
}

export default YieldPartyRow
