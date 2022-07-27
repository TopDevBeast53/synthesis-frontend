import { useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastFresh } from 'hooks/useRefresh'
import { BIG_ZERO } from 'utils/bigNumber'
import { convertSharesToHelix, getAprData } from 'views/Pools/helpers'
import useFetchUserBalances from 'hooks/useFetchUserBalances'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useSWR from 'swr'
import { useMulticallv2 } from 'hooks/useMulticall'
import useFetchPoolsPublicDataAsync from 'hooks/useFetchPoolsPublicDataAsync'
import { poolsConfig, SLOW_INTERVAL } from 'config/constants'
import { getAddress, getHelixAutoPoolAddress, getIfoPoolAddress, getLotteryV2Address } from 'utils/addressHelpers'
import { useHelix, useMasterchef } from 'hooks/useContract'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import sousChefABI from 'config/abi/sousChef.json'
import helixAutoPoolAbi from 'config/abi/HelixAutoPool.json'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import multicall from 'utils/multicall'
import useFetchFarms from 'state/farms/useFetchFarms'
import {
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
    setPoolsUserData,
    updatePoolsUserData,
} from '.'
import { State, DeserializedPool, VaultKey } from '../types'
import { getTokenPricesFromFarm, transformPool } from './helpers'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from '../farms'
import { fetchPoolsAllowance } from './fetchPoolsUser'
import useFetchVaultUser from './useFetchVaultUser'
import useFetchPublicVaultData from './useFetchPublicVaultData'
import useFetchIfoPoolUser from './useFetchIfoPoolUser'

export const usePoolsPageFetch = () => {
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    useFetchPublicPoolsData()
    const fetchUserBalances = useFetchUserBalances()
    const fetchPoolsUserDataAsync = useFetchPoolsUserDataAsync(account, fetchUserBalances)
    const fetchVaultUser = useFetchVaultUser()
    const fetchVaultFees = useFetchVaultFees()
    const fetchPublicVaultData = useFetchPublicVaultData()

    useFastRefreshEffect(() => {
        batch(() => {
            dispatch(fetchHelixVaultPublicData({ fetchPublicVaultData }))
            if (account) {
                dispatch(fetchPoolsUserDataAsync)
                dispatch(fetchHelixVaultUserData({ account, fetchVaultUser }))
            }
        })
    }, [account, dispatch, fetchVaultUser, fetchPublicVaultData])

    useEffect(() => {
        batch(() => {
            dispatch(fetchHelixVaultFees({ fetchVaultFees }))
        })
    }, [dispatch, fetchVaultFees])
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
    const fetchFarms = useFetchFarms()

    useEffect(() => {
        const fetchPoolsDataWithFarms = async () => {
            const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0)
            await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms.map((farm) => farm.pid), fetchFarms }))
            batch(() => {
                dispatch(fetchPoolsPublicDataAsync)
                dispatch(fetchPoolsStakingLimitsAsync())
            })
        }

        fetchPoolsDataWithFarms()
    }, [data, dispatch, fetchFarms, fetchPoolsPublicDataAsync])

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
    const fetchPoolsUserDataAsync = useFetchPoolsUserDataAsync(account, fetchUserBalances)

    useFastRefreshEffect(() => {
        if (account) {
            dispatch(fetchPoolsUserDataAsync)
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
    const fetchVaultUser = useFetchVaultUser()
    const fetchVaultFees = useFetchVaultFees()
    const fetchPublicVaultData = useFetchPublicVaultData()

    useEffect(() => {
        dispatch(fetchHelixVaultPublicData({ fetchPublicVaultData }))
    }, [dispatch, fastRefresh, fetchPublicVaultData])

    useEffect(() => {
        dispatch(fetchHelixVaultUserData({ account, fetchVaultUser }))
    }, [dispatch, fastRefresh, account, fetchVaultUser])

    useEffect(() => {
        dispatch(fetchHelixVaultFees({ fetchVaultFees }))
    }, [dispatch, fetchVaultFees])
}

export const useFetchIfoPool = (fetchHelixPool = true) => {
    const { account } = useWeb3React()
    const fastRefresh = useFastFresh()
    const dispatch = useAppDispatch()
    const fetchHelixPoolPublicDataAsync = useFetchHelixPoolPublicDataAsync()
    const fetchHelixPoolUserDataAsync = useFetchHelixPoolUserDataAsync(account)
    const fetchIfoPoolUser = useFetchIfoPoolUser()
    const fetchIfoPoolFeesData = useFetchIfoPoolFeesData()
    const fetchPublicIfoPoolData = useFetchPublicIfoPoolData()

    useEffect(() => {
        batch(() => {
            if (fetchHelixPool) {
                dispatch(fetchHelixPoolPublicDataAsync)
            }
            dispatch(fetchIfoPoolPublicData({ fetchPublicIfoPoolData }))
        })
    }, [dispatch, fastRefresh, fetchHelixPool, fetchHelixPoolPublicDataAsync, fetchPublicIfoPoolData])

    useEffect(() => {
        if (account) {
            batch(() => {
                dispatch(fetchIfoPoolUserAndCredit({ account, fetchIfoPoolUser }))
                if (fetchHelixPool) {
                    dispatch(fetchHelixPoolUserDataAsync)
                }
            })
        }
    }, [dispatch, fastRefresh, account, fetchHelixPool, fetchHelixPoolUserDataAsync, fetchIfoPoolUser])

    useEffect(() => {
        dispatch(fetchIfoPoolFees({ fetchIfoPoolFeesData }))
    }, [dispatch, fetchIfoPoolFeesData])
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
    const masterChefContract = useMasterchef()
    return useCallback(async (dispatch) => {
        const allowance = await helixContract.allowance(account, helixPoolAddress)
        const stakingTokenBalance = await helixContract.balanceOf(account)
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
    }, [account, helixContract, masterChefContract])
}

export const useFetchPoolsUserDataAsync = (account: string, fetchUserBalances: any) => {
    const fetchUserStakeBalances = useFetchUserStakeBalances()
    const fetchUserPendingRewards = useFetchUserPendingRewards()
    return useCallback(async (dispatch) => {
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
    }, [account, fetchUserBalances, fetchUserPendingRewards, fetchUserStakeBalances])
}

export const useUpdateUserStakedBalance = (sousId: number, account: string) => {
    const fetchUserStakeBalances = useFetchUserStakeBalances()
    return useCallback(async (dispatch) => {
        const stakedBalances = await fetchUserStakeBalances(account)
        dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
    }, [fetchUserStakeBalances, account, sousId])
}

const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 0)
export const useFetchUserStakeBalances = () => {
    const masterChefContract = useMasterchef()
    return useCallback(async (account) => {
        const calls = nonMasterPools.map((p) => ({
            address: getAddress(p.contractAddress),
            name: 'userInfo',
            params: [account],
        }))
        const userInfo = await multicall(sousChefABI, calls)
        const stakedBalances = nonMasterPools.reduce(
            (acc, pool, index) => ({
                ...acc,
                [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
            }),
            {},
        )

        // HELIX/ HELIXpool
        const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

        return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
    }, [masterChefContract])
}

export const useUpdateUserPendingReward = (sousId: number, account: string) => {
    const fetchUserPendingRewards = useFetchUserPendingRewards()
    return useCallback(async (dispatch) => {
        const pendingRewards = await fetchUserPendingRewards(account)
        dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
    }, [fetchUserPendingRewards, account, sousId])
}

export const useFetchUserPendingRewards = () => {
    const masterChefContract = useMasterchef()
    return useCallback(async (account) => {
        const calls = nonMasterPools.map((p) => ({
            address: getAddress(p.contractAddress),
            name: 'pendingReward',
            params: [account],
        }))
        const res = await multicall(sousChefABI, calls)
        const pendingRewards = nonMasterPools.reduce(
            (acc, pool, index) => ({
                ...acc,
                [pool.sousId]: new BigNumber(res[index]).toJSON(),
            }),
            {},
        )

        // Helix / Helix pool
        const pendingReward = await masterChefContract.pendingHelixToken('0', account)

        return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
    }, [masterChefContract])
}

export const useFetchVaultFees = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async () => {
        try {
            const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
                address: getHelixAutoPoolAddress(),
                name: method,
            }))

            const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(
                helixAutoPoolAbi,
                calls,
            )

            return {
                performanceFee: performanceFee.toNumber(),
                callFee: callFee.toNumber(),
                withdrawalFee: withdrawalFee.toNumber(),
                withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
            }
        } catch (error) {
            return {
                performanceFee: null,
                callFee: null,
                withdrawalFee: null,
                withdrawalFeePeriod: null,
            }
        }
    }, [multicallv2])
}

export const useFetchPublicIfoPoolData = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async () => {
        try {
            const calls = [
                'getPricePerFullShare',
                'totalShares',
                'calculateHarvestHelixRewards',
                'calculateTotalPendingHelixRewards',
                'startBlock',
                'endBlock',
            ].map((method) => ({
                address: getIfoPoolAddress(),
                name: method,
            }))

            const [
                [sharePrice],
                [shares],
                [estimatedHelixBountyReward],
                [totalPendingHelixHarvest],
                [startBlock],
                [endBlock],
            ] = await multicallv2(ifoPoolAbi, calls)

            const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
            const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
            const totalHelixInVaultEstimate = convertSharesToHelix(totalSharesAsBigNumber, sharePriceAsBigNumber)
            return {
                totalShares: totalSharesAsBigNumber.toJSON(),
                pricePerFullShare: sharePriceAsBigNumber.toJSON(),
                totalHelixInVault: totalHelixInVaultEstimate.helixAsBigNumber.toJSON(),
                estimatedHelixBountyReward: new BigNumber(estimatedHelixBountyReward.toString()).toJSON(),
                totalPendingHelixHarvest: new BigNumber(totalPendingHelixHarvest.toString()).toJSON(),
                creditStartBlock: startBlock.toNumber(),
                creditEndBlock: endBlock.toNumber(),
            }
        } catch (error) {
            return {
                totalShares: null,
                pricePerFullShare: null,
                totalHelixInVault: null,
                estimatedHelixBountyReward: null,
                totalPendingHelixHarvest: null,
            }
        }
    }, [multicallv2])
}

export const useFetchIfoPoolFeesData = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async () => {
        try {
            const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
                address: getIfoPoolAddress(),
                name: method,
            }))

            const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(
                ifoPoolAbi,
                calls,
            )

            return {
                performanceFee: performanceFee.toNumber(),
                callFee: callFee.toNumber(),
                withdrawalFee: withdrawalFee.toNumber(),
                withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
            }
        } catch (error) {
            return {
                performanceFee: null,
                callFee: null,
                withdrawalFee: null,
                withdrawalFeePeriod: null,
            }
        }
    }, [multicallv2])
}

export const useFetchCurrentLotteryIdAndMaxBuy = () => {
    const multicallv2 = useMulticallv2()
    return useCallback(async () => {
        try {
            const calls = ['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'].map((method) => ({
                address: getLotteryV2Address(),
                name: method,
            }))
            const [[currentLotteryId], [maxNumberTicketsPerBuyOrClaim]] = (await multicallv2(
                lotteryV2Abi,
                calls,
            )) as ethers.BigNumber[][]

            return {
                currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
                maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim
                    ? maxNumberTicketsPerBuyOrClaim.toString()
                    : null,
            }
        } catch (error) {
            return {
                currentLotteryId: null,
                maxNumberTicketsPerBuyOrClaim: null,
            }
        }
    }, [multicallv2])
}