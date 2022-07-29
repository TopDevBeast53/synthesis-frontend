import { useCallback } from 'react'
import erc20 from 'config/abi/erc20.json'
import { chunk } from 'lodash'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { useMulticallv2 } from 'hooks/useMulticall'
import { ChainId } from 'sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SerializedFarm } from '../types'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (chainId: ChainId, farm: SerializedFarm) => {
    const { lpAddress, token, quoteToken } = farm
    return [
        // Balance of token in the LP contract
        {
            address: token.address,
            name: 'balanceOf',
            params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
            address: quoteToken.address,
            name: 'balanceOf',
            params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
            address: lpAddress,
            name: 'balanceOf',
            params: [getMasterChefAddress(chainId)],
        },
        // Total supply of LP tokens
        {
            address: lpAddress,
            name: 'totalSupply',
        },
        // Token decimals
        {
            address: token.address,
            name: 'decimals',
        },
        // Quote token decimals
        {
            address: quoteToken.address,
            name: 'decimals',
        },
    ]
}

export const useFetchPublicFarmsData = () => {
    const multicallv2 = useMulticallv2()
    const { chainId } = useActiveWeb3React()
    return useCallback(async (farms: SerializedFarmConfig[]): Promise<any[]> => {
        const farmCalls = farms.flatMap((farm) => fetchFarmCalls(chainId, farm))
        const chunkSize = farmCalls.length / farms.length
        const farmMultiCallResult = await multicallv2(erc20, farmCalls)
        return chunk(farmMultiCallResult, chunkSize)
    }, [chainId, multicallv2])
}
