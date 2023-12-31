import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, HELIX_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'
import { ChainId } from 'sdk'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new helix allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
    stakingTokenPrice: number,
    rewardTokenPrice: number,
    totalStaked: number,
    tokenPerBlock: number,
    chainId: ChainId
): number => {
    const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR[chainId])
    const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
    const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getVaultApr = (
    totalStaked: number,
    tokenPerBlock: number,
    weight: number,
    chainId: ChainId
): number => {
    const totalRewardPricePerYear = new BigNumber(tokenPerBlock).times(BLOCKS_PER_YEAR[chainId])
    const totalStakingTokenInPool = new BigNumber(totalStaked)
    const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(weight)
    return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param helixPriceUsd Helix price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
    poolWeight: BigNumber,
    helixPriceUsd: BigNumber,
    poolLiquidityUsd: BigNumber,
    farmAddress: string,
    chainId: ChainId
): { helixRewardsApr: number; lpRewardsApr: number } => {
    const yearlyHelixRewardAllocation = poolWeight ? poolWeight.times(HELIX_PER_YEAR[chainId]) : new BigNumber(NaN)
    const helixRewardsApr = yearlyHelixRewardAllocation.times(helixPriceUsd).div(poolLiquidityUsd).times(100)
    let helixRewardsAprAsNumber = null
    if (!helixRewardsApr.isNaN() && helixRewardsApr.isFinite()) {
        helixRewardsAprAsNumber = helixRewardsApr.toNumber()
    }
    const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
    return { helixRewardsApr: helixRewardsAprAsNumber, lpRewardsApr }
}

export default null
