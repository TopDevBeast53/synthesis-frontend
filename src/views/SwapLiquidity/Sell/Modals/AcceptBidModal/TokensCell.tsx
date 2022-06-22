import React from 'react'
import { Skeleton } from 'uikit'
import { useAllTokens } from 'hooks/Tokens'
import ExTokenCell from './ExTokenCell'
import LPTokenCell from './LPTokenCell'

const TokensCell = (props) => {
  const { token, balance } = props
  const tokens = useAllTokens()

  if (!token) {
    return (
      <Skeleton />
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
