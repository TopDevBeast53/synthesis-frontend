import { useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastFresh } from 'hooks/useRefresh'
import { useFetchCurrentLotteryIdAndMaxBuy } from 'state/pools/hooks'
import { useMulticallv2 } from 'hooks/useMulticall'
import { getLotteryV2Address } from 'utils/addressHelpers'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { LotteryResponse, LotteryRoundGraphEntity, LotteryUserGraphEntity, State } from '../types'
import { fetchCurrentLotteryId, fetchCurrentLottery, fetchUserTicketsAndLotteries, fetchPublicLotteries } from '.'
import { applyNodeDataToLotteriesGraphResponse, applyNodeDataToUserGraphResponse, getGraphLotteries, getGraphLotteryUser, getRoundIdsArray, processViewLotteryErrorResponse, processViewLotterySuccessResponse, useProcessLotteryResponse } from './helpers'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'
// Lottery
export const useGetCurrentLotteryId = () => {
    return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetUserLotteriesGraphData = () => {
    return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetUserLotteryGraphRoundById = (lotteryId: string) => {
    const userLotteriesData = useGetUserLotteriesGraphData()
    return userLotteriesData.rounds.find((userRound) => userRound.lotteryId === lotteryId)
}

export const useGetLotteriesGraphData = () => {
    return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
    const lotteriesData = useGetLotteriesGraphData()
    return lotteriesData?.find((lottery) => lottery.id === lotteryId)
}

export const useFetchLottery = () => {
    const { account } = useWeb3React()
    const fastRefresh = useFastFresh()
    const dispatch = useAppDispatch()
    const currentLotteryId = useGetCurrentLotteryId()
    const fetchCurrentLotteryIdAndMaxBuy = useFetchCurrentLotteryIdAndMaxBuy()
    const getLotteriesData = useGetLotteriesData()
    const getUserLotteryData = useGetUserLotteryData()

    useEffect(() => {
        // get current lottery ID & max ticket buy
        dispatch(fetchCurrentLotteryId({ fetchCurrentLotteryIdAndMaxBuy }))
    }, [dispatch, fetchCurrentLotteryIdAndMaxBuy])

    useEffect(() => {
        if (currentLotteryId) {
            // Get historical lottery data from nodes +  last 100 subgraph entries
            dispatch(fetchPublicLotteries({ currentLotteryId, getLotteriesData }))
            // get public data for current lottery
            dispatch(fetchCurrentLottery({ currentLotteryId }))
        }
    }, [dispatch, currentLotteryId, fastRefresh, getLotteriesData])

    useEffect(() => {
        // get user tickets for current lottery, and user lottery subgraph data
        if (account && currentLotteryId) {
            dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId, getUserLotteryData }))
        }
    }, [dispatch, currentLotteryId, account, getUserLotteryData])
}

export const useLottery = () => {
    const currentRound = useSelector((state: State) => state.lottery.currentRound)
    const processedCurrentRound = useProcessLotteryResponse(currentRound)

    const isTransitioning = useSelector((state: State) => state.lottery.isTransitioning)

    const currentLotteryId = useGetCurrentLotteryId()
    const userLotteryData = useGetUserLotteriesGraphData()
    const lotteriesData = useGetLotteriesGraphData()

    const maxNumberTicketsPerBuyOrClaimAsString = useSelector(
        (state: State) => state.lottery.maxNumberTicketsPerBuyOrClaim,
    )
    const maxNumberTicketsPerBuyOrClaim = useMemo(() => {
        return new BigNumber(maxNumberTicketsPerBuyOrClaimAsString)
    }, [maxNumberTicketsPerBuyOrClaimAsString])

    return {
        currentLotteryId,
        maxNumberTicketsPerBuyOrClaim,
        isTransitioning,
        userLotteryData,
        lotteriesData,
        currentRound: processedCurrentRound,
    }
}

export const useFetchMultipleLotteries = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
        const calls = lotteryIds.map((id) => ({
            name: 'viewLottery',
            address: getLotteryV2Address(),
            params: [id],
        }))
        try {
            const multicallRes = await multicallv2(lotteryV2Abi, calls, { requireSuccess: false })
            const processedResponses = multicallRes.map((res, index) =>
                processViewLotterySuccessResponse(res[0], lotteryIds[index]),
            )
            return processedResponses
        } catch (error) {
            console.error(error)
            return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
        }
    }, [multicallv2])
}

export const useGetLotteriesData = () => {
    const fetchMultipleLotteries = useFetchMultipleLotteries()
    return useCallback(async (currentLotteryId: string): Promise<LotteryRoundGraphEntity[]> => {
        const idsForNodesCall = getRoundIdsArray(currentLotteryId)
        const nodeData = await fetchMultipleLotteries(idsForNodesCall)
        const graphResponse = await getGraphLotteries()
        const mergedData = applyNodeDataToLotteriesGraphResponse(nodeData, graphResponse)
        return mergedData
    }, [fetchMultipleLotteries])
}


export const useGetUserLotteryData = () => {
    const fetchMultipleLotteries = useFetchMultipleLotteries()
    return useCallback(async (account: string, currentLotteryId: string): Promise<LotteryUserGraphEntity> => {
        const idsForTicketsNodeCall = getRoundIdsArray(currentLotteryId)
        const roundDataAndUserTickets = await fetchUserTicketsForMultipleRounds(idsForTicketsNodeCall, account)
        const userRoundsNodeData = roundDataAndUserTickets.filter((round) => round.userTickets.length > 0)
        const idsForLotteriesNodeCall = userRoundsNodeData.map((round) => round.roundId)
        const lotteriesNodeData = await fetchMultipleLotteries(idsForLotteriesNodeCall)
        const graphResponse = await getGraphLotteryUser(account)
        const mergedRoundData = applyNodeDataToUserGraphResponse(
            userRoundsNodeData,
            graphResponse.rounds,
            lotteriesNodeData,
        )
        const graphResponseWithNodeRounds = { ...graphResponse, rounds: mergedRoundData }
        return graphResponseWithNodeRounds
    }, [fetchMultipleLotteries]);
}