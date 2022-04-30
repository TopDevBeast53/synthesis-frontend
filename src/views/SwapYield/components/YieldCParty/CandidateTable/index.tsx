import React, { useRef } from 'react'
import styled from 'styled-components'
import CandidateRow from './CandidateRow'


const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;  
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background: rgba(249, 250, 250, 0.08);
  backdrop-filter: blur(80px);
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const CandidateTable = (props) => {
    const {bids, exToken, approved} = props
    const tableWrapperEl = useRef<HTMLDivElement>(null)
    if(bids.length === 0) return null

    return (
      <StyledTableBorder>
        <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>        
          {
            bids.map((bid)=>(
              <CandidateRow key={bid.id} bid={bid} exToken={exToken} approved={approved}/>
            ))
          }
        </StyledTable>
      </StyledTableBorder>
    )
}
export default CandidateTable