export const ToolTipText = (lpTokenSymbol, lpTokenAmount, isGivingTokenLp, exTokenSymbol, exTokenAmount, isAskingTokenLp) =>
    `The swap creator is offering ${isGivingTokenLp ? "the yield generated by" : ""} ${lpTokenAmount} ${lpTokenSymbol} ${isGivingTokenLp ? "LP" : ""} token and is asking for ${isAskingTokenLp ? "the yield generated by" : ""} ${exTokenAmount} ${exTokenSymbol} ${isAskingTokenLp ? "LP" : ""} token.`
