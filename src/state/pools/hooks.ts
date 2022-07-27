import { useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastFresh } from 'hooks/useRefresh'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAprData } from 'views/Pools/helpers'
import useFetchUserBalances from 'hooks/useFetchUserBalances'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useSWR from 'swr'
import useFetchPoolsPublicDataAsync from 'hooks/useFetchPoolsPublicDataAsync'
import { poolsConfig, SLOW_INTERVAL } from 'config/constants'
import { getAddress } from 'utils/addressHelpers'
import { useHelix } from 'hooks/useContract'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { getMasterchefContract } from 'utils/contractHelpers'
import {
    fetchPoolsUserDataAsync,
    fetchHelixVaultPublicData,
    fetchHelixVaultUserData,
    fetchHelixVaultFees,
    fetchPoolsStakingLimitsAsync,
    fetchIfoPoolFees,
    fetchIfoPoolPublicData,
    fetchIfoPoolUserAndCredit,
    initialPoolVaultState,
    setPoolPublicData,
    setPoolUserData,
} from '.'
import { State, DeserializedPool, VaultKey } from '../types'
import { getTokenPricesFromFarm, transformPool } from './helpers'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../farms'

export const usePoolsPageFetch = () => {
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    useFetchPublicPoolsData()
    const fetchUserBalances = useFetchUserBalances()

    useFastRefreshEffect(() => {
        batch(() => {
            dispatch(fetchHelixVaultPublicData())
            if (account) {
                dispatch(fetchPoolsUserDataAsync(account, fetchUserBalances))
                dispatch(fetchHelixVaultUserData({ account }))
            }
        })
    }, [account, dispatch])

    useEffect(() => {
        batch(() => {
            dispatch(fetchHelixVaultFees())
        })
    }, [dispatch])
}

export function usePoolsWithVault() {
    const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools()
    const helixAutoPool = useHelixVault()
    // const ifoPool = useIfoPoolVault()
    const pools = useMemo(() => {
        const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
        const helixPool = activePools.find((pool) => pool.sousId === 0)
        const helixAutoVault = { ...helixPool, vaultKey: VaultKey.HelixAutoPool }
        // const ifoPoolVault = { ...helixPool, vaultKey: VaultKey.IfoPool }

        const helixAutoVaultWithApr = {
            ...helixAutoVault,
            apr: getAprData(helixAutoVault, helixAutoPool.fees.performanceFeeAsDecimal).apr,
            rawApr: helixPool.apr,
        }
        // const ifoPoolWithApr = {
        //   ...ifoPoolVault,
        //   apr: getAprData(ifoPoolVault, ifoPool.fees.performanceFeeAsDecimal).apr,
        //   rawApr: helixPool.apr,
        // }
        // return [ifoPoolWithApr, helixAutoVaultWithApr, ...poolsWithoutAutoVault]
        return [helixAutoVaultWithApr, ...poolsWithoutAutoVault]
        // }, [poolsWithoutAutoVault, helixAutoPool.fees.performanceFeeAsDecimal, ifoPool.fees.performanceFeeAsDecimal])
    }, [poolsWithoutAutoVault, helixAutoPool.fees.performanceFeeAsDecimal])

    return { pools, userDataLoaded }
}

export const useFetchPublicPoolsData = () => {
    const dispatch = useAppDispatch()

    const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber'])
    const fetchPoolsPublicDataAsync = useFetchPoolsPublicDataAsync(data)

    useEffect(() => {
        const fetchPoolsDataWithFarms = async () => {
            const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
            await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
            batch(() => {
                dispatch(fetchPoolsPublicDataAsync)
                dispatch(fetchPoolsStakingLimitsAsync())
            })
        }

        fetchPoolsDataWithFarms()
    }, [data, dispatch, fetchPoolsPublicDataAsync])

    // useSlowRefreshEffect(
    //     (currentBlock) => {
    //         const fetchPoolsDataWithFarms = async () => {
    //             const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
    //             await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
    //             batch(() => {
    //                 dispatch(fetchPoolsPublicDataAsync(currentBlock))
    //                 dispatch(fetchPoolsStakingLimitsAsync())
    //             })
    //         }

    //         fetchPoolsDataWithFarms()
    //     },
    //     [dispatch],
    // )
}

export const useFetchUserPools = (account) => {
    const dispatch = useAppDispatch()
    const fetchUserBalances = useFetchUserBalances()

    useFastRefreshEffect(() => {
        if (account) {
            dispatch(fetchPoolsUserDataAsync(account, fetchUserBalances))
        }
    }, [account, dispatch])
}

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
    const { pools, userDataLoaded } = useSelector((state: State) => ({
        pools: state.pools.data,
        userDataLoaded: state.pools.userDataLoaded,
    }))
    return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
    const { pool, userDataLoaded } = useSelector((state: State) => ({
        pool: state.pools.data.find((p) => p.sousId === sousId),
        userDataLoaded: state.pools.userDataLoaded,
    }))
    return { pool: transformPool(pool), userDataLoaded }
}

export const useFetchHelixVault = () => {
    const { account } = useWeb3React()
    const fastRefresh = useFastFresh()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchHelixVaultPublicData())
    }, [dispatch, fastRefresh])

    useEffect(() => {
        dispatch(fetchHelixVaultUserData({ account }))
    }, [dispatch, fastRefresh, account])

    useEffect(() => {
        dispatch(fetchHelixVaultFees())
    }, [dispatch])
}

export const useFetchIfoPool = (fetchHelixPool = true) => {
    const { account } = useWeb3React()
    const fastRefresh = useFastFresh()
    const dispatch = useAppDispatch()
    const fetchHelixPoolPublicDataAsync = useFetchHelixPoolPublicDataAsync()
    const fetchHelixPoolUserDataAsync = useFetchHelixPoolUserDataAsync(account)

    useEffect(() => {
        batch(() => {
            if (fetchHelixPool) {
                dispatch(fetchHelixPoolPublicDataAsync)
            }
            dispatch(fetchIfoPoolPublicData())
        })
    }, [dispatch, fastRefresh, fetchHelixPool, fetchHelixPoolPublicDataAsync])

    useEffect(() => {
        if (account) {
            batch(() => {
                dispatch(fetchIfoPoolUserAndCredit({ account }))
                if (fetchHelixPool) {
                    dispatch(fetchHelixPoolUserDataAsync)
                }
            })
        }
    }, [dispatch, fastRefresh, account, fetchHelixPool, fetchHelixPoolUserDataAsync])

    useEffect(() => {
        dispatch(fetchIfoPoolFees())
    }, [dispatch])
}

export const useHelixVault = () => {
    return useVaultPoolByKey(VaultKey.HelixAutoPool)
}

export const useVaultPools = () => {
    return {
        [VaultKey.HelixAutoPool]: useVaultPoolByKey(VaultKey.HelixAutoPool),
        // [VaultKey.IfoPool]: useVaultPoolByKey(VaultKey.IfoPool),
    }
}

export const useVaultPoolByKey = (key: VaultKey) => {
    const {
        totalShares: totalSharesAsString,
        pricePerFullShare: pricePerFullShareAsString,
        totalHelixInVault: totalHelixInVaultAsString,
        estimatedHelixBountyReward: estimatedHelixBountyRewardAsString,
        totalPendingHelixHarvest: totalPendingHelixHarvestAsString,
        fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
        userData: {
            isLoading,
            userShares: userSharesAsString,
            helixAtLastUserAction: helixAtLastUserActionAsString,
            lastDepositedTime,
            lastUserActionTime,
        },
    } = useSelector((state: State) => (key ? state.pools[key] : initialPoolVaultState))

    const estimatedHelixBountyReward = useMemo(() => {
        return new BigNumber(estimatedHelixBountyRewardAsString)
    }, [estimatedHelixBountyRewardAsString])

    const totalPendingHelixHarvest = useMemo(() => {
        return new BigNumber(totalPendingHelixHarvestAsString)
    }, [totalPendingHelixHarvestAsString])

    const totalShares = useMemo(() => {
        return new BigNumber(totalSharesAsString)
    }, [totalSharesAsString])

    const pricePerFullShare = useMemo(() => {
        return new BigNumber(pricePerFullShareAsString)
    }, [pricePerFullShareAsString])

    const totalHelixInVault = useMemo(() => {
        return new BigNumber(totalHelixInVaultAsString)
    }, [totalHelixInVaultAsString])

    const userShares = useMemo(() => {
        return new BigNumber(userSharesAsString)
    }, [userSharesAsString])

    const helixAtLastUserAction = useMemo(() => {
        return new BigNumber(helixAtLastUserActionAsString)
    }, [helixAtLastUserActionAsString])

    const performanceFeeAsDecimal = performanceFee && performanceFee / 100

    return {
        totalShares,
        pricePerFullShare,
        totalHelixInVault,
        estimatedHelixBountyReward,
        totalPendingHelixHarvest,
        fees: {
            performanceFeeAsDecimal,
            performanceFee,
            callFee,
            withdrawalFee,
            withdrawalFeePeriod,
        },
        userData: {
            isLoading,
            userShares,
            helixAtLastUserAction,
            lastDepositedTime,
            lastUserActionTime,
        },
    }
}

export const useIfoPoolVault = () => {
    return useVaultPoolByKey(VaultKey.IfoPool)
}

export const useIfoPoolCreditBlock = () => {
    return useSelector((state: State) => ({
        creditStartBlock: state.pools.ifoPool.creditStartBlock,
        creditEndBlock: state.pools.ifoPool.creditEndBlock,
        hasEndBlockOver: state.block.currentBlock >= state.pools.ifoPool.creditEndBlock,
    }))
}

export const useIfoPoolCredit = () => {
    const creditAsString = useSelector((state: State) => state.pools.ifoPool.userData?.credit ?? BIG_ZERO)
    const credit = useMemo(() => {
        return new BigNumber(creditAsString)
    }, [creditAsString])

    return credit
}

export const useIfoWithApr = () => {
    const {
        fees: { performanceFeeAsDecimal },
    } = useIfoPoolVault()
    const { pool: poolZero, userDataLoaded } = usePool(0)

    const ifoPoolWithApr = useMemo(() => {
        const ifoPool = { ...poolZero }
        ifoPool.vaultKey = VaultKey.IfoPool
        ifoPool.apr = getAprData(ifoPool, performanceFeeAsDecimal).apr
        ifoPool.rawApr = poolZero.apr
        return ifoPool
    }, [performanceFeeAsDecimal, poolZero])

    return {
        pool: ifoPoolWithApr,
        userDataLoaded,
    }
}

const helixPool = poolsConfig.find((pool) => pool.sousId === 0)
const helixPoolAddress = getAddress(helixPool.contractAddress)
export const useFetchHelixPoolPublicDataAsync = () => {
    const helixContract = useHelix()
    return useCallback(async (dispatch, getState) => {
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
    }, [helixContract])
}

export const useFetchHelixPoolUserDataAsync = (account: string) => {
    const helixContract = useHelix()
    return useCallback(async (dispatch) => {
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
    }, [account, helixContract])
}