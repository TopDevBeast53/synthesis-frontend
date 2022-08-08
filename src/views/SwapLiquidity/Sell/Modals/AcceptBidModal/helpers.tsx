
import { ChainId } from 'sdk'
import { getAddress } from 'utils/addressHelpers'

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