import React from 'react'
import { Skeleton} from 'uikit'
import { useAllTokens } from 'hooks/Tokens'
import { CellContent } from './BaseCell'
import ExTokenCell from './ExTokenCell'
import LPTokenCell from './LPTokenCell'

const TokensCell = (props) => {
  const { token, balance } = props
  const tokens = useAllTokens()

  if(!token){
    return (
        <CellContent>
        <Skeleton />
        <Skeleton mt="4px" />
      </CellContent>
    ) 
  }
  return (    
        tokens[token] ?
        <ExTokenCell exTokenAddress={token} balance={balance} />
        :
        <LPTokenCell lpTokenAddress={token} balance={balance} />
      
  )
  
}

export default TokensCell
