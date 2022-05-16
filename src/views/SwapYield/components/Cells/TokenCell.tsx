import React from 'react'
import { Skeleton} from 'uikit'
import { CellContent } from './BaseCell'
import ExTokenCell from './ExTokenCell'
import LPTokenCell from './LPTokenCell'

const TokenCell = (props) => {
  const { tokenInfo, swapData } = props
  if(!tokenInfo || !swapData){
    return (
        <CellContent>
        <Skeleton />
        <Skeleton mt="4px" />
      </CellContent>
    )
  }
  return (    
        tokenInfo.isLp === true ?
        <LPTokenCell lpTokenAddress={tokenInfo?.token} balance={tokenInfo?.amount.toString()} />
        :
        <ExTokenCell exTokenAddress={tokenInfo?.token} balance={swapData?.ask.toString()} />
      
  )
  
}

export default TokenCell
