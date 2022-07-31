import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { setPoolsPublicData } from 'state/pools'
import { getTokenPricesFromFarm } from 'state/pools/helpers'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress, getHelixAutoPoolAddress } from 'utils/addressHelpers'
import helixABI from 'config/abi/Helix.json'
import wbnbABI from 'config/abi/weth.json'
import { useFetchPoolsBlockLimits } from 'state/pools/hooks'
import { useGetPools } from 'state/pools/useGetPools'
import useProviders from './useProviders'
import { useMasterchef } from './useContract'
import useMulticall from './useMulticall'
import useActiveWeb3React from './useActiveWeb3React'
import { useGetTokens } from './useGetTokens'

const useFetchPoolsPublicDataAsync = (currentBlockNumber: number) => {
  const rpcProvider = useProviders();
  const fetchPoolsTotalStaking = useFetchPoolsTotalStaking()
  const fetchPoolsBlockLimits = useFetchPoolsBlockLimits()
  const { chainId } = useActiveWeb3React()
  const pools = useGetPools()

  return useCallback(async (dispatch, getState) => {
    const [blockLimits, totalStakings, currentBlock] = await Promise.all([
      fetchPoolsBlockLimits(),
      fetchPoolsTotalStaking(),
      currentBlockNumber ? Promise.resolve(currentBlockNumber) : rpcProvider.getBlockNumber(),
    ])

    const prices = getTokenPricesFromFarm(getState().farms.data)

    const liveData = pools.map((pool) => {
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

    dispatch(setPoolsPublicData({ data: liveData, chainId }))
  }, [chainId, currentBlockNumber, fetchPoolsBlockLimits, fetchPoolsTotalStaking, pools, rpcProvider])
}

const useFetchPoolsTotalStaking = () => {
  const masterChefContract = useMasterchef()
  const multicall = useMulticall()
  const { chainId } = useActiveWeb3React()
  const tokens = useGetTokens()
  const pools = useGetPools()

  return useCallback(async () => {
    const helixPools = pools.filter((p) => p.stakingToken.symbol !== 'ETH' && p.sousId === 0)
    const nonBnbPools = pools.filter((p) => p.stakingToken.symbol !== 'ETH' && p.sousId !== 0)
    const bnbPool = pools.filter((p) => p.stakingToken.symbol === 'ETH')

    const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
      return {
        address: poolConfig.stakingToken.address,
        name: 'balanceOf',
        params: [getAddress(chainId, poolConfig.contractAddress)],
      }
    })

    const callsBnbPools = bnbPool.map((poolConfig) => {
      return {
        address: tokens.weth.address,
        name: 'balanceOf',
        params: [getAddress(chainId, poolConfig.contractAddress)],
      }
    })

    const nonBnbPoolsTotalStaked = await multicall(helixABI, callsNonBnbPools)
    const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

    const [totalDepositedHelix, autoHelixDeposit] = await Promise.all([
      masterChefContract.depositedHelix(),
      masterChefContract.userInfo(0, getHelixAutoPoolAddress(chainId))
    ])
    return [
      ...helixPools.map(p => ({
        sousId: p.sousId,
        totalStaked: new BigNumber(totalDepositedHelix.toString()).toJSON(),
        manualStaked: new BigNumber(totalDepositedHelix.sub(autoHelixDeposit.amount).toString()).toJSON(),
      })),
      ...nonBnbPools.map((p, index) => ({
        sousId: p.sousId,
        totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
      })),
      ...bnbPool.map((p, index) => ({
        sousId: p.sousId,
        totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
      })),
    ]
  }, [chainId, masterChefContract, multicall, pools, tokens.weth.address])
}

export default useFetchPoolsPublicDataAsync