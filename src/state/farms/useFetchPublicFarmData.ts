import { useCallback } from 'react'
import erc20 from 'config/abi/erc20.json'
import { chunk } from 'lodash'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { useMulticallv2 } from 'hooks/useMulticall'
import { ChainId } from 'sdk'
import { SerializedFarm } from '../types'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (chainId: ChainId, farm: SerializedFarm) => {
    const { lpAddresses, token, quoteToken } = farm
    const lpAddress = getAddress(chainId, lpAddresses)
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
            params: [getMasterChefAddress()],
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

    return useCallback(async (farms: SerializedFarmConfig[]): Promise<any[]> => {
        const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
        const chunkSize = farmCalls.length / farms.length
        const farmMultiCallResult = await multicallv2(erc20, farmCalls)
        return chunk(farmMultiCallResult, chunkSize)
    }, [multicallv2])
}
