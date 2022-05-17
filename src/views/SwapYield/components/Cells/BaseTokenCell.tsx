import React from 'react'
import Balance from 'components/Balance'
import { Skeleton, Text } from 'uikit'
import { CellContent } from './BaseCell'

const BaseTokenCell = (props) => {
  const { tokenSymbol, balance } = props // moment Duration
  if (!tokenSymbol || balance === undefined) {
    return (
      <CellContent>
        <Skeleton />
        <Skeleton mt="4px" />
      </CellContent>
    )
  }
  return (
    <>
      <CellContent>
        <Text>{tokenSymbol}</Text>
        <Balance mt="4px" color="primary" value={balance} fontSize="14px" />
      </CellContent>
    </>
  )
}
export default BaseTokenCell
