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
const Group = (props) => {
  const { children, title } = props

  return (
    <StyledBorder {...props}>
      {children}
      {/* <StyledTitle> {title} </StyledTitle> */}
    </StyledBorder>
  )
}

export default Group
