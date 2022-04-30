import React from 'react'
import BaseTable from '../components/BaseTable'
import Row from './Row'


const SellTable= (props) => {
  const { data } = props
  return (
    <BaseTable>
      {
          data.map((swapId)=>(
            <Row key={swapId} data={swapId}/>
          ))
      }
    </BaseTable>
  )
}

export default SellTable
