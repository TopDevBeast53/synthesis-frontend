import React from 'react'
import styled from 'styled-components'
import { useAllTokens } from 'hooks/Tokens'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import { HelpIcon, useTooltip } from 'uikit'
import { ToolTipText } from 'views/SwapLiquidity/constants'

const ReferenceElement = styled.div`
  display: inline-block;
`
const Container = styled.div``

const ToolTipCell = ({ buyerToken, buyerTokenAmount, sellerToken, sellerTokenAmount }) => {
  const { data: farms } = useFarms()
  const tokens = useAllTokens()

  const lpToken = farms.find((item) => getAddress(item.lpAddresses) === buyerToken)
  const exToken = farms.find((item) => getAddress(item.lpAddresses) === sellerToken)

  const tooltipText = ToolTipText(lpToken.lpSymbol, buyerTokenAmount, exToken.lpSymbol, sellerTokenAmount)
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
