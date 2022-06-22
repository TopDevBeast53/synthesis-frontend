
import { getAddress } from 'utils/addressHelpers'

export const getTokenSymbol = (farms, tokens, tokenInfo) => {
  if (tokenInfo.isLp) {
    const lpToken = farms.find((item) => getAddress(item.lpAddresses) === tokenInfo.token)
    return lpToken ? lpToken.lpSymbol : ""
  }
  const token = tokens[tokenInfo.token]
  return token ? token.symbol : ""
}

export const getTokenDecimals = (farms, tokens, tokenInfo) => {
  if (tokenInfo.isLp) {
    const lpToken = farms.find((item) => getAddress(item.lpAddresses) === tokenInfo.token)
    return lpToken ? lpToken.token.decimals : 18
  }
  const token = tokens[tokenInfo.token]
  return token ? token.decimals : 18
}