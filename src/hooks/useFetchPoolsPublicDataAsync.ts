import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { useCallback } from 'react'
import { setPoolsPublicData } from 'state/pools'
import { fetchPoolsBlockLimits } from 'state/pools/fetchPools'
import { getTokenPricesFromFarm } from 'state/pools/helpers'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress, getHelixAutoPoolAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import helixABI from 'config/abi/Helix.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import useProviders from './useProviders'
import { useMasterchef } from './useContract'

const useFetchPoolsPublicDataAsync = (currentBlockNumber: number) => {
  const rpcProvider = useProviders();
  const fetchPoolsTotalStaking = useFetchPoolsTotalStaking()

  return useCallback(async (dispatch, getState) => {
    const [blockLimits, totalStakings, currentBlock] = await Promise.all([
      fetchPoolsBlockLimits(),
      fetchPoolsTotalStaking(),
      currentBlockNumber ? Promise.resolve(currentBlockNumber) : rpcProvider.getBlockNumber(),
    ])

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
  }, [currentBlockNumber, fetchPoolsTotalStaking, rpcProvider])
}

const useFetchPoolsTotalStaking = () => {
  const masterChefContract = useMasterchef()
  return useCallback(async () => {
    const helixPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'ETH' && p.sousId === 0)
    const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'ETH' && p.sousId !== 0)
    const bnbPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'ETH')

    const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
      return {
        address: poolConfig.stakingToken.address,
        name: 'balanceOf',
        params: [getAddress(poolConfig.contractAddress)],
      }
    })

    const callsBnbPools = bnbPool.map((poolConfig) => {
      return {
        address: tokens.weth.address,
        name: 'balanceOf',
        params: [getAddress(poolConfig.contractAddress)],
      }
    })

    const nonBnbPoolsTotalStaked = await multicall(helixABI, callsNonBnbPools)
    const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

    const [totalDepositedHelix, autoHelixDeposit] = await Promise.all([
      masterChefContract.depositedHelix(),
      masterChefContract.userInfo(0, getHelixAutoPoolAddress())
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
  }, [masterChefContract])
}

export default useFetchPoolsPublicDataAsync