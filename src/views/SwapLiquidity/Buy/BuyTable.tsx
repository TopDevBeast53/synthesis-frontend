import React from 'react'
import BaseTable from '../components/BaseTable'
import Row from './Row'


const SellTable= (props) => {

  const { data } = props
  return (
    <BaseTable>
      {
          data.map((swap)=>(
            <Row key={swap.id} data={swap}/>
          ))
      }
    </BaseTable>
  )
}

export default SellTable
