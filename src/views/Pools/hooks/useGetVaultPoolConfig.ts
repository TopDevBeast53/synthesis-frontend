import { getVaultPoolConfig } from "config/constants/pools"
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useMemo } from "react"

export const useGetVaultPoolConfig = () => {
    const { chainId } = useActiveWeb3React()
    const vaultPoolConfig = useMemo(() => getVaultPoolConfig(chainId), [chainId])

    return vaultPoolConfig
}