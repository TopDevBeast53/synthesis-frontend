import { useAllTokens } from 'hooks/Tokens'
import { useFarms } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'

export const useTokenSymbol = (tokenInfo) => {
    const { data: farms } = useFarms()
    const allTokens = useAllTokens()
    if(!tokenInfo) return ""
    const address  = tokenInfo.token
    if (tokenInfo.isLp){
        const lpToken = farms.find((item) => getAddress(item.lpAddresses) === address)
        return lpToken.lpSymbol
    }
    
    const exToken = allTokens[address]
    return exToken? exToken.symbol : ""
}
