import masterchefABI from 'config/abi/masterchef.json'
import { chunk } from 'lodash'
import { useCallback } from 'react'
import { useMulticallv2 } from 'hooks/useMulticall'
import { ChainId } from 'sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getMasterChefAddress } from '../../utils/addressHelpers'

const fetchMasterChefFarmCalls = (chainId: ChainId, farm: SerializedFarm) => {
    const { pid } = farm
    return pid || pid === 0
        ? [
            {
                address: getMasterChefAddress(chainId),
                name: 'poolInfo',
                params: [pid],
            },
            {
                address: getMasterChefAddress(chainId),
                name: 'totalAllocPoint',
            },
        ]
        : [null, null]
}

export const useFetchMasterChefData = () => {
    const multicallv2 = useMulticallv2()
    const { chainId } = useActiveWeb3React()
    return useCallback(async (farms: SerializedFarmConfig[]): Promise<any[]> => {
        const masterChefCalls = farms.map((farm) => fetchMasterChefFarmCalls(chainId, farm))
        const chunkSize = masterChefCalls.flatMap((masterChefCall) => masterChefCall).length / farms.length
        const masterChefAggregatedCalls = masterChefCalls
            .filter((masterChefCall) => {
                return masterChefCall[0] !== null && masterChefCall[1] !== null
            })
            .flatMap((masterChefCall) => masterChefCall)
        const masterChefMultiCallResult = await multicallv2(masterchefABI, masterChefAggregatedCalls)
        const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)
        let masterChefChunkedResultCounter = 0
        return masterChefCalls.map((masterChefCall) => {
            if (masterChefCall[0] === null && masterChefCall[1] === null) {
                return [null, null]
            }
            const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
            masterChefChunkedResultCounter++
            return data
        })
    }, [chainId, multicallv2])
}
