import { useAllTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'

export const useTokenSymbol = (tokenInfo) => {
    const { data: farms } = useFarms()
    const allTokens = useAllTokens()
    const { chainId } = useActiveWeb3React()
    if (!tokenInfo) return ""
    const address = tokenInfo.token
    if (tokenInfo.isLp) {
        const lpToken = farms.find((item) => getAddress(chainId, item.lpAddresses) === address)
        return lpToken.lpSymbol
    }

    const exToken = allTokens[address]
    return exToken ? exToken.symbol : ""
}

export const useTokenDecimals = (tokenInfo) => {
    const { data: farms } = useFarms()
    const allTokens = useAllTokens()
    const { chainId } = useActiveWeb3React()

    if (!tokenInfo) return 18
    const address = tokenInfo.token
    if (tokenInfo.isLp) {
        const lpToken = farms.find((item) => getAddress(chainId, item.lpAddresses) === address)
        return lpToken.token.decimals
    }

    const exToken = allTokens[address]
    return exToken ? exToken.decimals : 18
}
