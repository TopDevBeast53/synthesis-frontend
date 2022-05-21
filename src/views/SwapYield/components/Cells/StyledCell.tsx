import styled from 'styled-components'
import BaseCell from './BaseCell'

export const StyledRow = styled.div`
  background-color: transparent;
  flex-wrap:wrap;
  display: flex;
  cursor: pointer;
  padding-right:12px;  
`

export const StyledCell = styled(BaseCell)`  
  flex:1;
  padding-right:0px;
  padding-left:0px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 2 120px; 
    padding-right:10px;
    padding-left:10px;    
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left:32px;
  }
`

export const StyledCellWithoutPadding = styled(BaseCell)`  
  padding-left:0px;
  padding-right:0px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 18px;
  }
`
