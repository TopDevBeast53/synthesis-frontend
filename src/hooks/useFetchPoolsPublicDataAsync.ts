import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import { useCallback } from 'react'
import { setPoolsPublicData } from 'state/pools'
import { fetchPoolsBlockLimits, fetchPoolsTotalStaking } from 'state/pools/fetchPools'
import { getTokenPricesFromFarm } from 'state/pools/helpers'
import { getPoolApr } from 'utils/apr'
import { getBalanceNumber } from 'utils/formatBalance'
import useProviders from './useProviders'

const useFetchPoolsPublicDataAsync = (currentBlockNumber: number) => {
  const rpcProvider = useProviders();
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
  }, [currentBlockNumber, rpcProvider])
}

export default useFetchPoolsPublicDataAsync