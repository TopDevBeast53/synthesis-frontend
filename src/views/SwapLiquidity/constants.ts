import { getHelixLPSwapAddress } from 'utils/addressHelpers'

export const lpSwapAddress = getHelixLPSwapAddress()

export const ToolTipText = (lpTokenSymbol, lpTokenAmount, isGivingTokenLp, exTokenSymbol, exTokenAmount, isAskingTokenLp) =>
    `The swap creator is offering ${lpTokenAmount} ${lpTokenSymbol} ${isGivingTokenLp ? "LP" : ""} token and is asking for ${exTokenAmount} ${exTokenSymbol} ${isAskingTokenLp ? "LP" : ""} token.`
