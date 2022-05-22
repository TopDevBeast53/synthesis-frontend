import React, { useContext, useMemo } from 'react'
import { SwapLiquidityContext } from 'views/SwapLiquidity/context'
import { useAllTokens } from 'hooks/Tokens'
import ActiveRow from './ActiveRow'
import AppliedRow from './AppliedRow'
import FinishedRow from './FinishedRow'
import { SwapState } from '../../types'

const Row = ({ data }) => {

  const tokens = useAllTokens()
  const buyer = useMemo(()=>{
      if (!data) return undefined
      if(tokens[data.toSellerToken])
          return {token:data.toSellerToken, isLp:false}
      return {token:data.toSellerToken, isLp:true}
  },[data, tokens])
  const seller = useMemo(()=>{
      if (!data) return undefined
      if(tokens[data.toBuyerToken])
        return {token:data.toBuyerToken, isLp:false, amount:data.amount}
      return {token:data.toBuyerToken, isLp:true, amount:data.amount}
  },[data, tokens])


  const { filterState } = useContext(SwapLiquidityContext)
  if (filterState === SwapState.Applied) return <AppliedRow swapData={data} seller={seller} buyer={buyer}/>
  if (filterState === SwapState.Finished) return <FinishedRow swapData={data} seller={seller} buyer={buyer}/>
  return <ActiveRow swapData={data} seller={seller} buyer={buyer}/>
}

export default Row
