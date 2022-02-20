import BigNumber from 'bignumber.js'
import { convertSharesToAura } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import ifoPoolAbi from 'config/abi/ifoPool.json'
import { getIfoPoolAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicIfoPoolData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestAuraRewards',
      'calculateTotalPendingAuraRewards',
      'startBlock',
      'endBlock',
    ].map((method) => ({
      address: getIfoPoolAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedAuraBountyReward], [totalPendingAuraHarvest], [startBlock], [endBlock]] =
      await multicallv2(ifoPoolAbi, calls)

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalAuraInVaultEstimate = convertSharesToAura(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalAuraInVault: totalAuraInVaultEstimate.auraAsBigNumber.toJSON(),
      estimatedAuraBountyReward: new BigNumber(estimatedAuraBountyReward.toString()).toJSON(),
      totalPendingAuraHarvest: new BigNumber(totalPendingAuraHarvest.toString()).toJSON(),
      creditStartBlock: startBlock.toNumber(),
      creditEndBlock: endBlock.toNumber(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalAuraInVault: null,
      estimatedAuraBountyReward: null,
      totalPendingAuraHarvest: null,
    }
  }
}

export const fetchIfoPoolFeesData = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getIfoPoolAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(ifoPoolAbi, calls)

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
}

export default fetchPublicIfoPoolData
