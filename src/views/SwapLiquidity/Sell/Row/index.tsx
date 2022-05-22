import { useAllTokens } from 'hooks/Tokens'
import { useHelixLpSwap } from 'hooks/useContract'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { OrderState } from 'views/SwapYield/types'
import ActiveRow from './ActiveRow'
import EarnedRow from './EarnedRow'

const Row = ({ data: swapId }) => {
  const LpSwapContract = useHelixLpSwap()
  const { filterState } = useContext(SwapLiquidityContext)
  const [swapData, setSwapData] = useState<any>()
  const tokens = useAllTokens()

  const buyer = useMemo(()=>{
      if (!swapData) return undefined
      if(tokens[swapData.toSellerToken])
          return {token:swapData.toSellerToken, isLp:false}
      return {token:swapData.toSellerToken, isLp:true}
  },[swapData, tokens])
  const seller = useMemo(()=>{
      if (!swapData) return undefined
      if(tokens[swapData.toBuyerToken])
        return {token:swapData.toBuyerToken, isLp:false, amount:swapData.amount}
      return {token:swapData.toBuyerToken, isLp:true, amount:swapData.amount}
  },[swapData, tokens])
  useEffect(() => {
    LpSwapContract.getSwap(swapId).then((swap) => {
      setSwapData(swap)
    })
  }, [LpSwapContract, swapId])

  if (filterState === OrderState.Completed) return <EarnedRow swapData={swapData} seller={seller} buyer={buyer} />
  return <ActiveRow swapData={swapData} swapId={swapId} seller={seller} buyer={buyer} />
}

export default Row
