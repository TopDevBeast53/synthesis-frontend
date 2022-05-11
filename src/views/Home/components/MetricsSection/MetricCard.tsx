import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardProps } from 'uikit'

const StyledCard = styled(Card)<{
  background: string
  rotation?: string
  leftRounded?: boolean
  rightRounded?: boolean
}>`
  height: fit-content;
  box-sizing: border-box;
  border: 2px solid rgba(16, 20, 17, 0.5);
  border-radius: ${({ leftRounded, rightRounded }) =>
    (leftRounded ? '12px ' : '0px ') + (rightRounded ? '12px 12px ' : '0px 0px ') + (leftRounded ? '12px ' : '0px ')};

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }

  background: ${({ theme }) => theme.colors.primary};
  color: #101411;
`

interface IconCardProps extends CardProps {
  children: ReactNode
  leftRounded?: boolean
  rightRounded?: boolean
}

const MetricCard: React.FC<IconCardProps> = ({ background, children, ...props }) => {
  return (
    <StyledCard background={background} {...props}>
      {children}
    </StyledCard>
  )
}

export default MetricCard
