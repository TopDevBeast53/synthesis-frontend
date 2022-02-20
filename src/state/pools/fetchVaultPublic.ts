import BigNumber from 'bignumber.js'
import { convertSharesToAura } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import auraVaultAbi from 'config/abi/auraVault.json'
import { getAuraVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestAuraRewards',
      'calculateTotalPendingAuraRewards',
    ].map((method) => ({
      address: getAuraVaultAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedAuraBountyReward], [totalPendingAuraHarvest]] = await multicallv2(
      auraVaultAbi,
      calls,
    ) 

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalAuraInVaultEstimate = convertSharesToAura(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalAuraInVault: totalAuraInVaultEstimate.auraAsBigNumber.toJSON(),
      estimatedAuraBountyReward: new BigNumber(estimatedAuraBountyReward.toString()).toJSON(),
      totalPendingAuraHarvest: new BigNumber(totalPendingAuraHarvest.toString()).toJSON(),
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

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getAuraVaultAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(auraVaultAbi, calls)

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

export default fetchPublicVaultData
