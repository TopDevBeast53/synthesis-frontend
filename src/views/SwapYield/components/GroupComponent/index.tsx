import React from 'react'
import styled from 'styled-components'
// background-color: ${({ theme }) => theme.colors.cardBorder};

const StyledBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background: rgba(249, 250, 250, 0.08);
  backdrop-filter: blur(80px);
  padding: 1em;
  background-size: 400% 400%;
  position: relative;
`
const StyledTitle = styled.div`
  position: absolute;
  left: 1em;
  top: -0.7em;
  color: #57e58e;
  font-weight: bold;
  background: #414147;
  padding: 0.3em 0.5em;
  border-radius: 10px;
`
const Group = (props) => {
  const { children, title } = props

  return (
    <StyledBorder {...props}>
      {children}
      <StyledTitle> {title} </StyledTitle>
    </StyledBorder>
  )
}

export default Group
