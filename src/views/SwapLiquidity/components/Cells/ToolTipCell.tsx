import React from 'react'
import styled from 'styled-components'
import { useAllTokens } from 'hooks/Tokens'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import { HelpIcon, useTooltip } from 'uikit'
import { ToolTipText } from 'views/SwapLiquidity/constants'
import { getBalanceNumber } from 'utils/formatBalance'
import { ChainId } from 'sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const ReferenceElement = styled.div`
  display: inline-block;
`
const Container = styled.div``
export const getTokenSymbol = (chainId: ChainId, farms, tokens, tokenInfo) => {
  if (tokenInfo.isLp) {
    const lpToken = farms.find((item) => getAddress(chainId, item.lpAddresses) === tokenInfo.token)
    return lpToken ? lpToken.lpSymbol : ""
  }
  const token = tokens[tokenInfo.token]
  return token ? token.symbol : ""
}

export const getTokenDecimals = (chainId: ChainId, farms, tokens, tokenInfo) => {
  if (tokenInfo.isLp) {
    const lpToken = farms.find((item) => getAddress(chainId, item.lpAddresses) === tokenInfo.token)
    return lpToken ? lpToken.token.decimals : 18
  }
  const token = tokens[tokenInfo.token]
  return token ? token.decimals : 18
}
const ToolTipCell = ({ seller, buyer, askAmount }) => {
  const { data: farms } = useFarms()
  const tokens = useAllTokens()
  const { chainId } = useActiveWeb3React()

  const tooltipText = (seller && buyer) ?
    ToolTipText(
      getTokenSymbol(chainId, farms, tokens, seller),
      getBalanceNumber(seller.amount.toString(), getTokenDecimals(chainId, farms, tokens, seller)).toString(),
      seller.isLp,
      getTokenSymbol(chainId, farms, tokens, buyer),
      getBalanceNumber(askAmount.toString(), getTokenDecimals(chainId, farms, tokens, buyer)).toString(),
      buyer.isLp
    )
    :
    ""
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipText, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })
  if (!seller || !buyer) {
    return null
  }

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
