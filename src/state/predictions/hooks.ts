import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { minBy, orderBy } from 'lodash'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { getPredictionsAddress } from 'utils/addressHelpers'
import { PredictionsClaimableResponse, PredictionsLedgerResponse, PredictionsRoundsResponse } from 'utils/types'
import { useMulticallv2 } from 'hooks/useMulticall'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import predictionsAbi from 'config/abi/predictions.json'
import { State, NodeRound, ReduxNodeLedger, NodeLedger, ReduxNodeRound, PredictionsState, PredictionStatus } from '../types'
import { MarketData, parseBigNumberObj } from './helpers'
import { fetchAddressResult } from '.'

export const useGetRounds = () => {
    const rounds = useSelector((state: State) => state.predictions.rounds)
    return Object.keys(rounds).reduce((accum, epoch) => {
        return {
            ...accum,
            [epoch]: parseBigNumberObj<ReduxNodeRound, NodeRound>(rounds[epoch]),
        }
    }, {}) as { [key: string]: NodeRound }
}

export const useGetRound = (epoch: number) => {
    const round = useSelector((state: State) => state.predictions.rounds[epoch])
    return parseBigNumberObj<ReduxNodeRound, NodeRound>(round)
}

export const useGetSortedRounds = () => {
    const roundData = useGetRounds()
    return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useGetBetByEpoch = (account: string, epoch: number) => {
    const bets = useSelector((state: State) => state.predictions.ledgers)

    if (!bets[account]) {
        return null
    }

    if (!bets[account][epoch]) {
        return null
    }

    return parseBigNumberObj<ReduxNodeLedger, NodeLedger>(bets[account][epoch])
}

export const useGetIsClaimable = (epoch) => {
    const claimableStatuses = useSelector((state: State) => state.predictions.claimableStatuses)
    return claimableStatuses[epoch] || false
}

/**
 * Used to get the range of rounds to poll for
 */
export const useGetEarliestEpoch = () => {
    return useSelector((state: State) => {
        const earliestRound = minBy(Object.values(state.predictions.rounds), 'epoch')
        return earliestRound?.epoch
    })
}

export const useIsHistoryPaneOpen = () => {
    return useSelector((state: State) => state.predictions.isHistoryPaneOpen)
}

export const useIsChartPaneOpen = () => {
    return useSelector((state: State) => state.predictions.isChartPaneOpen)
}

export const useGetCurrentEpoch = () => {
    return useSelector((state: State) => state.predictions.currentEpoch)
}

export const useGetIntervalSeconds = () => {
    return useSelector((state: State) => state.predictions.intervalSeconds)
}

export const useGetCurrentRound = () => {
    const currentEpoch = useGetCurrentEpoch()
    const rounds = useGetRounds()
    return rounds[currentEpoch]
}

export const useGetPredictionsStatus = () => {
    return useSelector((state: State) => state.predictions.status)
}

export const useGetHistoryFilter = () => {
    return useSelector((state: State) => state.predictions.historyFilter)
}

export const useGetHasHistoryLoaded = () => {
    return useSelector((state: State) => state.predictions.hasHistoryLoaded)
}

export const useGetCurrentHistoryPage = () => {
    return useSelector((state: State) => state.predictions.currentHistoryPage)
}

export const useGetMinBetAmount = () => {
    const minBetAmount = useSelector((state: State) => state.predictions.minBetAmount)
    return useMemo(() => ethers.BigNumber.from(minBetAmount), [minBetAmount])
}

export const useGetBufferSeconds = () => {
    return useSelector((state: State) => state.predictions.bufferSeconds)
}

export const useGetIsFetchingHistory = () => {
    return useSelector((state: State) => state.predictions.isFetchingHistory)
}

export const useGetHistory = () => {
    return useSelector((state: State) => state.predictions.history)
}

export const useGetLastOraclePrice = () => {
    const lastOraclePrice = useSelector((state: State) => state.predictions.lastOraclePrice)
    return useMemo(() => {
        return ethers.BigNumber.from(lastOraclePrice)
    }, [lastOraclePrice])
}

/**
 * The current round's lock timestamp will not be set immediately so we return an estimate until then
 */
export const useGetCurrentRoundLockTimestamp = () => {
    const currentRound = useGetCurrentRound()
    const intervalSeconds = useGetIntervalSeconds()

    if (!currentRound.lockTimestamp) {
        return currentRound.startTimestamp + intervalSeconds
    }

    return currentRound.lockTimestamp
}

// Leaderboard
export const useGetLeaderboardLoadingState = () => {
    return useSelector((state: State) => state.predictions.leaderboard.loadingState)
}

export const useGetLeaderboardResults = () => {
    return useSelector((state: State) => state.predictions.leaderboard.results)
}

export const useGetLeaderboardFilters = () => {
    return useSelector((state: State) => state.predictions.leaderboard.filters)
}

export const useGetLeaderboardSkip = () => {
    return useSelector((state: State) => state.predictions.leaderboard.skip)
}

export const useGetLeaderboardHasMoreResults = () => {
    return useSelector((state: State) => state.predictions.leaderboard.hasMoreResults)
}

export const useGetAddressResult = (account: string) => {
    return useSelector((state: State) => state.predictions.leaderboard.addressResults[account])
}

export const useGetOrFetchLeaderboardAddressResult = (account: string) => {
    const addressResult = useGetAddressResult(account)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const address = isAddress(account)

        // If address result is null it means we already tried fetching the results and none came back
        if (!addressResult && addressResult !== null && address) {
            dispatch(fetchAddressResult(account))
        }
    }, [dispatch, account, addressResult])

    return addressResult
}

export const useGetSelectedAddress = () => {
    return useSelector((state: State) => state.predictions.leaderboard.selectedAddress)
}

export const useGetRoundsData = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()
    return useCallback(async (epochs: number[]): Promise<PredictionsRoundsResponse[]> => {
        const address = getPredictionsAddress(chainId)
        const calls = epochs.map((epoch) => ({
            address,
            name: 'rounds',
            params: [epoch],
        }))
        const response = await multicallv2<PredictionsRoundsResponse[]>(predictionsAbi, calls)
        return response
    }, [multicallv2, chainId])
}

export const useGetClaimStatuses = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()
    return useCallback(async (
        account: string,
        epochs: number[],
    ): Promise<PredictionsState['claimableStatuses']> => {
        const address = getPredictionsAddress(chainId)
        const claimableCalls = epochs.map((epoch) => ({
            address,
            name: 'claimable',
            params: [epoch, account],
        }))
        const claimableResponses = await multicallv2<[PredictionsClaimableResponse][]>(predictionsAbi, claimableCalls)

        return claimableResponses.reduce((accum, claimableResponse, index) => {
            const epoch = epochs[index]
            const [claimable] = claimableResponse

            return {
                ...accum,
                [epoch]: claimable,
            }
        }, {})
    }, [multicallv2, chainId])
}

export const useGetLedgerData = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()
    return useCallback(async (account: string, epochs: number[]) => {
        const address = getPredictionsAddress(chainId)
        const ledgerCalls = epochs.map((epoch) => ({
            address,
            name: 'ledger',
            params: [epoch, account],
        }))
        const response = await multicallv2<PredictionsLedgerResponse[]>(predictionsAbi, ledgerCalls)
        return response
    }, [multicallv2, chainId])
}

export const useGetPredictionData = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()
    return useCallback(async (): Promise<MarketData> => {
        const address = getPredictionsAddress(chainId)
        const staticCalls = ['currentEpoch', 'intervalSeconds', 'minBetAmount', 'paused', 'bufferSeconds'].map(
            (method) => ({
                address,
                name: method,
            }),
        )
        const [[currentEpoch], [intervalSeconds], [minBetAmount], [paused], [bufferSeconds]] = await multicallv2(
            predictionsAbi,
            staticCalls,
        )

        return {
            status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
            currentEpoch: currentEpoch.toNumber(),
            intervalSeconds: intervalSeconds.toNumber(),
            minBetAmount: minBetAmount.toString(),
            bufferSeconds: bufferSeconds.toNumber(),
        }
    }, [multicallv2, chainId])
}