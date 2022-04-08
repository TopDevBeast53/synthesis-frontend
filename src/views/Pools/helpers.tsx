import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { DeserializedPool } from 'state/types'
import { getApy } from 'utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'

export const convertSharesToHelix = (
  shares: BigNumber,
  helixPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(helixPerFullShare, decimals)
  const amountInHelix = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const helixAsNumberBalance = getBalanceNumber(amountInHelix, decimals)
  const helixAsBigNumber = getDecimalAmount(new BigNumber(helixAsNumberBalance), decimals)
  const helixAsDisplayBalance = getFullDisplayBalance(amountInHelix, decimals, decimalsToRound)
  return { helixAsNumberBalance, helixAsBigNumber, helixAsDisplayBalance }
}

export const convertHelixToShares = (
  helix: BigNumber,
  helixPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(helixPerFullShare, decimals)
  const amountInShares = new BigNumber(helix.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: DeserializedPool, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = vaultKey
    ? vaultPoolConfig[vaultKey].autoCompoundFrequency
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getVaultEarnings = (
  account: string,
  helixAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
) => {
  const hasAutoEarnings =
    account && helixAtLastUserAction && helixAtLastUserAction.gt(0) && userShares && userShares.gt(0)
  const { helixAsBigNumber } = convertSharesToHelix(userShares, pricePerFullShare)
  const autoHelixProfit = helixAsBigNumber.minus(helixAtLastUserAction)
  const autoHelixToDisplay = autoHelixProfit.gte(0) ? getBalanceNumber(autoHelixProfit, 18) : 0

  const autoUsdProfit = autoHelixProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoHelixToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = (pool: DeserializedPool, currentBlock: number) => {
  const { startBlock, endBlock, isFinished } = pool
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
  const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart
  return { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay }
}
