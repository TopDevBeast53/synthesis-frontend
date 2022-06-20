import styled from 'styled-components'
import BaseCell from './BaseCell'

export const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
  align-items: center;
  `

export const MobileRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
  flex-direction: column;
`

export const StyledCell = styled(BaseCell)`  
  flex: 2;
  padding-left:12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px; 
    padding-left:32px;    
  }
`

export const SkeletonCell = styled(BaseCell)`  
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px; 
  }
`

export const AddressCell = styled(BaseCell)`  
  flex: 2.5;
  padding-left:12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 150px; 
    padding-left:32px;    
  }
`

export const GivingTokenCell = styled(BaseCell)`  
  flex: 2;
  padding-left:12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 150px; 
    padding-left:32px;    
  }
`

export const StyledCellWithoutPadding = styled(BaseCell)`
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 50px;
  }
`

export const QuestionCell = styled(BaseCell)`
  flex: 1;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    align-items: flex-start;
    flex: 1 0 50px;
  }
`

export const AskingTokenCell = styled(BaseCell)`
  flex: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 150px;
  }
`

export const ButtonRow = styled(BaseCell)`  
  flex: 2;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 100px; 
  }
`

export const MobileButtonRow = styled(BaseCell)`  
  flex: 2;
  padding-top: 0px;
  padding-right: 40px;
  padding-left: 40px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 8px;
    padding-left: 8px;
    flex: 2 0 100px; 
  }
`

export const MobileButtonColumnCell = styled(BaseCell)`  
  flex: 2;
  padding-top: 0px;
  padding-right: 40px;
  padding-left: 40px;
  flex-direction: row;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    padding-right: 8px;
    padding-left: 8px;
    flex: 2 0 100px; 
  }
`
