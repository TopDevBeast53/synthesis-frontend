import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/pools'
import {
    AppThunk,
    HelixAutoPool,
    IfoHelixVault,
    IfoVaultUser,
    PoolsState,
    SerializedPool,
    VaultFees,
    VaultUser,
} from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { fetchIfoPoolFeesData, fetchPublicIfoPoolData } from './fetchIfoPoolPublic'
import fetchIfoPoolUserData from './fetchIfoPoolUser'
import {
    fetchPoolsAllowance,
    fetchUserPendingRewards,
    fetchUserStakeBalances,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import fetchVaultUser from './fetchVaultUser'

export const initialPoolVaultState = Object.freeze({
    totalShares: null,
    pricePerFullShare: null,
    totalHelixInVault: null,
    estimatedHelixBountyReward: null,
    totalPendingHelixHarvest: null,
    fees: {
        performanceFee: null,
        callFee: null,
        withdrawalFee: null,
        withdrawalFeePeriod: null,
    },
    userData: {
        isLoading: true,
        userShares: null,
        helixAtLastUserAction: null,
        lastDepositedTime: null,
        lastUserActionTime: null,
        credit: null,
    },
    creditStartBlock: null,
})

const initialState: PoolsState = {
    data: [...poolsConfig],
    userDataLoaded: false,
    helixAutoPool: initialPoolVaultState,
    ifoPool: initialPoolVaultState,
}

export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
    const poolsWithStakingLimit = getState()
        .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
        .map((pool) => pool.sousId)

    const stakingLimits = {} // For unlimit it : await fetchPoolsStakingLimits(poolsWithStakingLimit)

    const stakingLimitData = poolsConfig.map((pool) => {
        if (poolsWithStakingLimit.includes(pool.sousId)) {
            return { sousId: pool.sousId }
        }
        const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO
        return {
            sousId: pool.sousId,
            stakingLimit: stakingLimit.toJSON(),
        }
    })

    dispatch(setPoolsPublicData(stakingLimitData))
}

export const fetchPoolsUserDataAsync =
    (account: string, fetchUserBalances: any): AppThunk =>
        async (dispatch) => {
            const [allowances, stakingTokenBalances, stakedBalances, pendingRewards] = await Promise.all([
                fetchPoolsAllowance(account),
                fetchUserBalances(account),
                fetchUserStakeBalances(account),
                fetchUserPendingRewards(account),
            ])
            const userData = poolsConfig.map((pool) => ({
                sousId: pool.sousId,
                allowance: allowances[pool.sousId],
                stakingTokenBalance: stakingTokenBalances[pool.sousId],
                stakedBalance: stakedBalances[pool.sousId],
                pendingReward: pendingRewards[pool.sousId],
            }))

            dispatch(setPoolsUserData(userData))
        }

export const updateUserAllowance =
    (sousId: number, account: string): AppThunk =>
        async (dispatch) => {
            const allowances = await fetchPoolsAllowance(account)
            dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
        }

export const updateUserBalance =
    (sousId: number, account: string, fetchUserBalances: any): AppThunk =>
        async (dispatch) => {
            const tokenBalances = await fetchUserBalances(account)
            dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
        }

export const updateUserStakedBalance =
    (sousId: number, account: string): AppThunk =>
        async (dispatch) => {
            const stakedBalances = await fetchUserStakeBalances(account)
            dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
        }

export const updateUserPendingReward =
    (sousId: number, account: string): AppThunk =>
        async (dispatch) => {
            const pendingRewards = await fetchUserPendingRewards(account)
            dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
        }

export const fetchHelixVaultPublicData = createAsyncThunk<HelixAutoPool>('helixAutoPool/fetchPublicData', async () => {
    const publicVaultInfo = await fetchPublicVaultData()
    return publicVaultInfo
})

export const fetchHelixVaultFees = createAsyncThunk<VaultFees>('helixAutoPool/fetchFees', async () => {
    const vaultFees = await fetchVaultFees()
    return vaultFees
})

export const fetchHelixVaultUserData = createAsyncThunk<VaultUser, { account: string }>(
    'helixAutoPool/fetchUser',
    async ({ account }) => {
        const userData = await fetchVaultUser(account)
        return userData
    },
)

export const fetchIfoPoolPublicData = createAsyncThunk<IfoHelixVault>('ifoPool/fetchPublicData', async () => {
    const publicVaultInfo = await fetchPublicIfoPoolData()
    return publicVaultInfo
})

export const fetchIfoPoolFees = createAsyncThunk<VaultFees>('ifoPool/fetchFees', async () => {
    const vaultFees = await fetchIfoPoolFeesData()
    return vaultFees
})

export const fetchIfoPoolUserAndCredit = createAsyncThunk<IfoVaultUser, { account: string }>(
    'ifoPool/fetchUser',
    async ({ account }) => {
        const userData = await fetchIfoPoolUserData(account)
        return userData
    },
)

export const PoolsSlice = createSlice({
    name: 'Pools',
    initialState,
    reducers: {
        setPoolPublicData: (state, action) => {
            const { sousId } = action.payload
            const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
            state.data[poolIndex] = {
                ...state.data[poolIndex],
                ...action.payload.data,
            }
        },
        setPoolUserData: (state, action) => {
            const { sousId } = action.payload
            const poolIndex = state.data.findIndex((pool) => pool.sousId === sousId)
            state.data[poolIndex].userData = action.payload.data
        },
        setPoolsPublicData: (state, action) => {
            const livePoolsData: SerializedPool[] = action.payload
            state.data = state.data.map((pool) => {
                const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
                return { ...pool, ...livePoolData }
            })
        },
        setPoolsUserData: (state, action) => {
            const userData = action.payload
            state.data = state.data.map((pool) => {
                const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
                return { ...pool, userData: userPoolData }
            })
            state.userDataLoaded = true
        },
        updatePoolsUserData: (state, action) => {
            const { field, value, sousId } = action.payload
            const index = state.data.findIndex((p) => p.sousId === sousId)

            if (index >= 0) {
                state.data[index] = {
                    ...state.data[index],
                    userData: { ...state.data[index].userData, [field]: value },
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Vault public data that updates frequently
        builder.addCase(fetchHelixVaultPublicData.fulfilled, (state, action: PayloadAction<HelixAutoPool>) => {
            state.helixAutoPool = { ...state.helixAutoPool, ...action.payload }
        })
        // Vault fees
        builder.addCase(fetchHelixVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
            const fees = action.payload
            state.helixAutoPool = { ...state.helixAutoPool, fees }
        })
        // Vault user data
        builder.addCase(fetchHelixVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
            const userData = action.payload
            userData.isLoading = false
            state.helixAutoPool = { ...state.helixAutoPool, userData }
        })
        // Vault public data that updates frequently
        builder.addCase(fetchIfoPoolPublicData.fulfilled, (state, action) => {
            state.ifoPool = { ...state.ifoPool, ...action.payload }
        })
        // Vault fees
        builder.addCase(fetchIfoPoolFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
            const fees = action.payload
            state.ifoPool = { ...state.ifoPool, fees }
        })
        // Vault user data
        builder.addCase(fetchIfoPoolUserAndCredit.fulfilled, (state, action) => {
            const userData = action.payload
            userData.isLoading = false
            state.ifoPool = { ...state.ifoPool, userData }
        })
    },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData, setPoolPublicData, setPoolUserData } =
    PoolsSlice.actions

export default PoolsSlice.reducer
