import { ChainId, Currency, ETHER, Token } from 'sdk'
import { EtherIcon } from 'uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGetTokens } from 'hooks/useGetTokens'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getImageUrlFromToken = (tokens: any, token: Token) => {
  const address = ['ETH', 'RBTC'].includes(token.symbol) ? tokens.weth.address : token.address
  return `/images/tokens/${address}.svg`
}

const getImageURLForDefaultToken = (tokens: any) => {
  return `/images/tokens/${tokens.weth.address}.svg`
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
  const { chainId } = useActiveWeb3React()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER[chainId]) {
      if ([ChainId.MAINNET, ChainId.TESTNET].includes(chainId)) return []
      return [getImageURLForDefaultToken(tokens)]
    }

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getImageUrlFromToken(tokens, currency), getTokenLogoURL(currency.address)]
      }
      return [getImageUrlFromToken(tokens, currency), getTokenLogoURL(currency.address)]
    }
    return []
  }, [chainId, currency, tokens, uriLocations])

  if (currency === ETHER[chainId]) {
    if ([ChainId.MAINNET, ChainId.TESTNET].includes(chainId)) return <EtherIcon width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
