import React from 'react'
import styled from 'styled-components'
import { HelpIcon, useTooltip } from 'uikit'

const ReferenceElement = styled.div`
  display: inline-block;
`
const Container = styled.div``

const ToolTipCell = ({ tooltipText }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipText, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default ToolTipCell
