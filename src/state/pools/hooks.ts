import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastFresh, useSlowFresh } from 'hooks/useRefresh'
import { BIG_ZERO } from 'utils/bigNumber'
import { getAprData } from 'views/Pools/helpers'
import {
    fetchPoolsPublicDataAsync,
    fetchPoolsUserDataAsync,
    fetchHelixVaultPublicData,
    fetchHelixVaultUserData,
    fetchHelixVaultFees,
    fetchPoolsStakingLimitsAsync,
    fetchIfoPoolFees,
    fetchIfoPoolPublicData,
    fetchIfoPoolUserAndCredit,
    initialPoolVaultState,
    fetchHelixPoolPublicDataAsync,
    fetchHelixPoolUserDataAsync,
} from '.'
import { State, DeserializedPool, VaultKey } from '../types'
import { transformPool } from './helpers'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../farms'

export const useFetchPublicPoolsData = () => {
    const dispatch = useAppDispatch()
    const slowRefresh = useSlowFresh()

    useEffect(() => {
        const fetchPoolsDataWithFarms = async () => {
            const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
            await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
            batch(() => {
                dispatch(fetchPoolsPublicDataAsync())
                dispatch(fetchPoolsStakingLimitsAsync())
            })
        }

        fetchPoolsDataWithFarms()
    }, [dispatch, slowRefresh])
}

export const useFetchUserPools = (account) => {
    const fastRefresh = useFastFresh()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (account) {
            dispatch(fetchPoolsUserDataAsync(account))
        }
    }, [account, dispatch, fastRefresh])
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

    useEffect(() => {
        batch(() => {
            if (fetchHelixPool) {
                dispatch(fetchHelixPoolPublicDataAsync())
            }
            dispatch(fetchIfoPoolPublicData())
        })
    }, [dispatch, fastRefresh, fetchHelixPool])

    useEffect(() => {
        if (account) {
            batch(() => {
                dispatch(fetchIfoPoolUserAndCredit({ account }))
                if (fetchHelixPool) {
                    dispatch(fetchHelixPoolUserDataAsync(account))
                }
            })
        }
    }, [dispatch, fastRefresh, account, fetchHelixPool])

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
