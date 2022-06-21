import React from 'react'
import YieldPartyRow from './Row'
import BaseTable from '../BaseTable'


const YieldPartyTable = (props) => {
  const { data } = props
  return (
    <BaseTable>
      {data.map((swapId) => (
        <YieldPartyRow key={swapId} data={swapId} />
      ))}
    </BaseTable>
  )
}

export default YieldPartyTable
