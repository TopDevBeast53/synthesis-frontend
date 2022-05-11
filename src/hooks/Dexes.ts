import type { ExternalRouterData } from 'config/constants/externalRouters'
import externalRouters from 'config/constants/externalRouters'
import { Token } from 'sdk'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export function useAllExternalDexesWithTokens(): ExternalRouterData[] {
    const { chainId } = useActiveWeb3React()

    const savedExternalRouters = useSelector<AppState, AppState['user']['externalRouters']>(
        ({ user: { externalRouters: router } }) => router,
    )

    const savedExternalRoutes = savedExternalRouters.map((router) => ({
        ...router,
        pairToken: new Token(
            router.pairToken.chainID,
            router.pairToken.address,
            18,
            router.pairToken.symbol,
            router.pairToken.name,
        ),
    }))

    return savedExternalRoutes.concat(externalRouters).filter((dex) => dex.chainID === chainId)
}

export function useIsExternalDexWithTokenActive(token: Token | undefined | null): boolean {
    const tokenDex = useExternalDexFromToken(token)
    return tokenDex != null
}

export function useExternalDexFromToken(token: Token | undefined): ExternalRouterData | undefined {
    const activeExternalTokens = useAllExternalDexesWithTokens()

    if (token == null) {
        return null
    }

    return activeExternalTokens.find((dex) => dex.pairToken.address === token.address)
}
