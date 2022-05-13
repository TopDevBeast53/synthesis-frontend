import styled from 'styled-components'
import { StyledMenuItemProps } from './types'

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;

  ${({ $isActive, $variant, theme }) =>
    $isActive &&
    $variant === 'subMenu' &&
    `
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        height: 4px;
        width: 100%;
        background-color: ${theme.colors.primary};
        border-radius: 2px 2px 0 0;
      }
    `};
`

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-items: center;
  font-family: 'system-ui', sans-serif;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.secondary : theme.colors.textSubtle)};
  font-size: 18px;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '500')};
  line-height: 148%;

  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant, theme }) =>
    $variant === 'default'
      ? `    
    padding: 0 10px;    
    @media screen and (min-width: 1650px){
      padding: 0 20px;
    }
    @media screen and (min-width: 1800px){
      padding: 0 28px;
    }
    
    height: 48px;
  `
      : `
    padding: 4px 4px 0px 4px;
    height: 42px;
  `}

  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
    border-radius: 12px;
  }
`

export default StyledMenuItem
