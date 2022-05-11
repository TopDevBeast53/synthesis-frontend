import styled from 'styled-components'
import BaseCell from './BaseCell'

export const StyledRow = styled.div`
  background-color: transparent;

  display: flex;
  cursor: pointer;
`

export const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

export const StyledCellWithoutPadding = styled(BaseCell)`
  flex: 4.5;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`
