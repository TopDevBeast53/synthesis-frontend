import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit'
import YieldCPartyRow from './Row'
import BaseTable from '../BaseTable'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  justify-content: center;
  cursor: pointer;
`

const StyledCol = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
  font-style: italic;
`
const YieldCPartyTable = ({ swaps, state, loading }) => {
  return (
    <BaseTable>
      {!loading && swaps.length === 0 && (
        <StyledRow>
          <StyledCol>
            <Text>No Data</Text>
          </StyledCol>
        </StyledRow>
      )}
      {swaps.map((data) => (
        <YieldCPartyRow key={data.id} data={data} state={state} loading={loading} />
      ))}
    </BaseTable>
  )
}

export default YieldCPartyTable
