import type {
    UnknownAsyncThunkFulfilledAction,
    UnknownAsyncThunkPendingAction,
    UnknownAsyncThunkRejectedAction,
    // eslint-disable-next-line import/no-unresolved
} from '@reduxjs/toolkit/dist/matchers'
import { createAsyncThunk, createSlice, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import stringify from 'fast-json-stable-stringify'
import getFarms from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import type { AppState } from 'state'
import priceHelperLpsConfig from 'config/constants/priceHelperLps'
import { ChainId } from 'sdk'
import getFarmsPrices from './getFarmsPrices'
import { SerializedFarmsState, SerializedFarm } from '../types'

const noAccountFarmConfig = getFarms(ChainId.MAINNET).map((farm) => ({
    ...farm,
    userData: {
        allowance: '0',
        tokenBalance: '0',
        stakedBalance: '0',
        earnings: '0',
    },
}))

const initialState: SerializedFarmsState = {
    data: noAccountFarmConfig,
    loadArchivedFarmsData: false,
    userDataLoaded: false,
    loadingKeys: {},
}

export const getNonArchivedFarms = (chainId: ChainId) => getFarms(chainId).filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchFarmsPublicDataAsync = createAsyncThunk<
    SerializedFarm[],
    { pids: number[], fetchFarms: any, chainId: ChainId },
    {
        state: AppState
    }
>(
    'farms/fetchFarmsPublicDataAsync',
    async ({ pids, fetchFarms, chainId }) => {
        const farmsToFetch = getFarms(chainId).filter((farmConfig) => pids.includes(farmConfig.pid))

        // Add price helper farms
        const farmsWithPriceHelpers = farmsToFetch.concat(priceHelperLpsConfig)

        const farms = await fetchFarms(farmsWithPriceHelpers)
        const farmsWithPrices = getFarmsPrices(farms)

        // Filter out price helper LP config farms
        const farmsWithoutHelperLps = farmsWithPrices.filter((farm: SerializedFarm) => {
            return farm.pid || farm.pid === 0
        })

        return farmsWithoutHelperLps
    },
    {
        condition: (arg, { getState }) => {
            const { farms } = getState()
            if (farms.loadingKeys[stringify({ type: fetchFarmsPublicDataAsync.typePrefix, arg })]) {
                console.debug('farms action is fetching, skipping here')
                return false
            }
            return true
        },
    },
)

interface FarmUserDataResponse {
    pid: number
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
}

export const fetchFarmUserDataAsync = createAsyncThunk<
    FarmUserDataResponse[],
    {
        account: string; pids: number[],
        fetchFarmUserAllowances: any,
        fetchFarmUserTokenBalances: any,
        fetchFarmUserStakedBalances: any,
        fetchFarmUserEarnings: any,
        chainId: ChainId
    },
    {
        state: AppState
    }
>(
    'farms/fetchFarmUserDataAsync',
    async ({ account, pids, chainId, fetchFarmUserAllowances,
        fetchFarmUserTokenBalances, fetchFarmUserStakedBalances, fetchFarmUserEarnings }) => {
        const farmsToFetch = getFarms(chainId).filter((farmConfig) => pids.includes(farmConfig.pid))
        const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
        const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
        const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
        const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

        return userFarmAllowances.map((farmAllowance, index) => {
            return {
                pid: farmsToFetch[index].pid,
                allowance: userFarmAllowances[index],
                tokenBalance: userFarmTokenBalances[index],
                stakedBalance: userStakedBalances[index],
                earnings: userFarmEarnings[index],
            }
        })
    },
    {
        condition: (arg, { getState }) => {
            const { farms } = getState()
            if (farms.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
                console.debug('farms user action is fetching, skipping here')
                return false
            }
            return true
        },
    },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
    | UnknownAsyncThunkFulfilledAction
    | UnknownAsyncThunkPendingAction
    | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
    action: UnknownAsyncThunkFulfilledOrPendingAction,
    suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
    const type = action.type.split(`/${suffix}`)[0]
    return stringify({
        arg: action.meta.arg,
        type,
    })
}

export const farmsSlice = createSlice({
    name: 'Farms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Update farms with live data
        builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
            state.data = state.data.map((farm) => {
                const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid)
                return { ...farm, ...liveFarmData }
            })
        })

        // Update farms with user data
        builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
            action.payload.forEach((userDataEl) => {
                const { pid } = userDataEl
                const index = state.data.findIndex((farm) => farm.pid === pid)
                state.data[index] = { ...state.data[index], userData: userDataEl }
            })
            state.userDataLoaded = true
        })

        builder.addMatcher(isPending, (state, action) => {
            state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
        })
        builder.addMatcher(isFulfilled, (state, action) => {
            state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
        })
        builder.addMatcher(isRejected, (state, action) => {
            state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
        })
    },
})

export default farmsSlice.reducer
