import React from 'react'
import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from 'uikit'
import { Token, ETHER } from 'sdk'
import { useGetTokens } from 'hooks/useGetTokens'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (tokens: any, token: Token) => {
  const address = ETHER[token.chainId].symbol === token.symbol ? tokens.weth.address : token.address
  return `/images/tokens/${address}.svg`
}

export const TokenPairImage: React.FC<TokenPairImageProps> = ({ primaryToken, secondaryToken, ...props }) => {
  const tokens = useGetTokens()
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(tokens, primaryToken)}
      secondarySrc={getImageUrlFromToken(tokens, secondaryToken)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<TokenImageProps> = ({ token, ...props }) => {
  const tokens = useGetTokens()
  return <UIKitTokenImage src={getImageUrlFromToken(tokens, token)} {...props} />
}
