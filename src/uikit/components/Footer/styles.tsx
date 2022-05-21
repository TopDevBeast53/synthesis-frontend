import styled from 'styled-components'
import { darkColors } from '../../theme/colors'
import { Box, Flex } from '../Box'

export const StyledFooter = styled(Flex)`
  background: ${darkColors.backgroundAlt};  
`

export const StyledList = styled.ul`
  list-style: none;
  margin-bottom: 40px;  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex:1;    
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
  }
`

export const StyledListItem = styled.li`
  font-size: 14px;
  margin-top: 10px;
  text-transform: capitalize;
  font-weight:500;    

  &:first-child {
    margin-top:0px;
    padding-bottom:5px;
    color: ${darkColors.secondary};
    font-weight: 700;    
    font-size: 16px;
  }
  a{
    font-size: 14px;
  }
`

export const StyledIconMobileContainer = styled(Box)`
  margin-bottom: 24px;
  text-align:center;
`

export const StyledToolsContainer = styled(Flex)`
  border-color: ${darkColors.cardBorder};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
  padding: 24px 0;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-width: 0;
    border-bottom-width: 0;
    padding: 0 0;
    margin-bottom: 0;
  }
`

export const StyledText = styled.span`
  color: ${darkColors.text};
`
