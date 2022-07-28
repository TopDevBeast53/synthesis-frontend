import { Currency, ETHER, Token } from 'sdk'
import { EtherIcon } from 'uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useGetTokens } from 'hooks/useGetTokens'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getImageUrlFromToken = (tokens: any, token: Token) => {
  const address = token.symbol === 'ETH' ? tokens.weth.address : token.address
  return `/images/tokens/${address}.svg`
}

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const tokens = useGetTokens()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getImageUrlFromToken(tokens, currency), getTokenLogoURL(currency.address)]
      }
      return [getImageUrlFromToken(tokens, currency), getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, tokens, uriLocations])

  if (currency === ETHER) {
    return <EtherIcon width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
