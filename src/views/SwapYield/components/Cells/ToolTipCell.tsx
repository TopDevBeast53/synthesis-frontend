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
const getTokenSymbol = (farms, tokens, tokenInfo) => {  
  if (tokenInfo.isLp){
    const lpToken = farms.find((item) => getAddress(item.lpAddresses) === tokenInfo.token)
    return lpToken? lpToken.lpSymbol  :""
  }
  const token = tokens[tokenInfo.token]
  return token?  token.symbol : ""
  
}
const ToolTipCell = ({ seller, buyer, askAmount }) => {

  const { data: farms } = useFarms()
  const tokens = useAllTokens()

  const tooltipText = (seller && buyer) ? 
                                        ToolTipText(
                                          getTokenSymbol(farms, tokens, seller), 
                                          seller.amount.toString(), 
                                          getTokenSymbol(farms, tokens, buyer), 
                                          askAmount.toString()) 
                                        :
                                          ""
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
