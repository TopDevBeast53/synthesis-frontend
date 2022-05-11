import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
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
import { getAddress } from 'utils/addressHelpers'
import { getPoolApr } from 'utils/apr'
import { BIG_ZERO } from 'utils/bigNumber'
import { getHelixContract, getMasterchefContract } from 'utils/contractHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { simpleRpcProvider } from 'utils/providers'
import { fetchIfoPoolFeesData, fetchPublicIfoPoolData } from './fetchIfoPoolPublic'
import fetchIfoPoolUserData from './fetchIfoPoolUser'
import { fetchPoolsBlockLimits, fetchPoolsTotalStaking } from './fetchPools'
import {
    fetchPoolsAllowance,
    fetchUserBalances,
    fetchUserPendingRewards,
    fetchUserStakeBalances,
} from './fetchPoolsUser'
import { fetchPublicVaultData, fetchVaultFees } from './fetchVaultPublic'
import fetchVaultUser from './fetchVaultUser'
import { getTokenPricesFromFarm } from './helpers'

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

// Thunks
const helixPool = poolsConfig.find((pool) => pool.sousId === 0)
const helixPoolAddress = getAddress(helixPool.contractAddress)
const helixContract = getHelixContract()

export const fetchHelixPoolPublicDataAsync = () => async (dispatch, getState) => {
    const prices = getTokenPricesFromFarm(getState().farms.data)
    const stakingTokenAddress = helixPool.stakingToken.address ? helixPool.stakingToken.address.toLowerCase() : null
    const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0
    const earningTokenAddress = helixPool.earningToken.address ? helixPool.earningToken.address.toLowerCase() : null
    const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0

    const totalStaking = await helixContract.balanceOf(helixPoolAddress)

    const apr = getPoolApr(
        stakingTokenPrice,
        earningTokenPrice,
        getBalanceNumber(new BigNumber(totalStaking ? totalStaking.toString() : 0), helixPool.stakingToken.decimals),
        parseFloat(helixPool.tokenPerBlock),
    )

    dispatch(
        setPoolPublicData({
            sousId: 0,
            data: {
                totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
                stakingTokenPrice,
                earningTokenPrice,
                apr,
            },
        }),
    )
}

export const fetchHelixPoolUserDataAsync = (account: string) => async (dispatch) => {
    const allowance = await helixContract.allowance(account, helixPoolAddress)
    const stakingTokenBalance = await helixContract.balanceOf(account)
    const masterChefContract = getMasterchefContract()
    const pendingReward = await masterChefContract.pendingHelixToken('0', account)
    const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

    dispatch(
        setPoolUserData({
            sousId: 0,
            data: {
                allowance: new BigNumber(allowance.toString()).toJSON(),
                stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
                pendingReward: new BigNumber(pendingReward.toString()).toJSON(),
                stakedBalances: new BigNumber(masterPoolAmount.toString()).toJSON(),
            },
        }),
    )
}

export const fetchPoolsPublicDataAsync = () => async (dispatch, getState) => {
    const blockLimits = await fetchPoolsBlockLimits()
    const totalStakings = await fetchPoolsTotalStaking()
    let currentBlock = getState().block?.currentBlock

    if (!currentBlock) {
        currentBlock = await simpleRpcProvider.getBlockNumber()
    }

    const prices = getTokenPricesFromFarm(getState().farms.data)

    const liveData = poolsConfig.map((pool) => {
        const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId)
        const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId)
        const isPoolEndBlockExceeded =
            currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false
        const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded

        const stakingTokenAddress = pool.stakingToken.address ? pool.stakingToken.address.toLowerCase() : null
        const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0

        const earningTokenAddress = pool.earningToken.address ? pool.earningToken.address.toLowerCase() : null
        const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0

        const apr = !isPoolFinished
            ? getPoolApr(
                  stakingTokenPrice,
                  earningTokenPrice,
                  getBalanceNumber(new BigNumber(totalStaking.totalStaked), pool.stakingToken.decimals),
                  parseFloat(pool.tokenPerBlock),
              )
            : 0

        return {
            ...blockLimit,
            ...totalStaking,
            stakingTokenPrice,
            earningTokenPrice,
            apr,
            isFinished: isPoolFinished,
        }
    })

    dispatch(setPoolsPublicData(liveData))
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
    (account: string): AppThunk =>
    async (dispatch) => {
        const allowances = await fetchPoolsAllowance(account)
        const stakingTokenBalances = await fetchUserBalances(account)
        const stakedBalances = await fetchUserStakeBalances(account)
        const pendingRewards = await fetchUserPendingRewards(account)

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
    (sousId: number, account: string): AppThunk =>
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
