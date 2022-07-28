import { getPools } from 'config/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

export const useGetPools = () => {
    const { chainId } = useActiveWeb3React()
    return useMemo(() => getPools(chainId), [chainId])
}