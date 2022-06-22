import React from 'react'
import { Skeleton } from 'uikit'
import ExTokenCell from './ExTokenCell'
import LPTokenCell from './LPTokenCell'

const TokenCell = (props) => {
  const { tokenInfo, amount } = props
  if (!tokenInfo || amount === undefined) {
    return (
      <Skeleton />
    )
  }
  return (
    tokenInfo.isLp === true ?
      <LPTokenCell lpTokenAddress={tokenInfo?.token} balance={amount} />
      :
      <ExTokenCell exTokenAddress={tokenInfo?.token} balance={amount} />
  )
}

export default TokenCell
