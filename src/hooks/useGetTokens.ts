import getTokens from "config/constants/tokens"
import { useMemo } from "react"
import useActiveWeb3React from "./useActiveWeb3React"

export const useGetTokens = () => {
    const { chainId } = useActiveWeb3React()
    return useMemo(() => getTokens(chainId), [chainId])

}