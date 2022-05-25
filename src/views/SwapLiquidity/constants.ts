import { getHelixLPSwapAddress } from 'utils/addressHelpers'

export const lpSwapAddress = getHelixLPSwapAddress()

export const ToolTipText = (lpTokenSymbol, lpTokenAmount, exTokenSymbol, exTokenAmount, isLiquidity=false) =>
!isLiquidity ? `The swap creator is offering yield genereated by ${lpTokenAmount} ${lpTokenSymbol} LP token and is asking for the yield generated by ${exTokenAmount} ${exTokenSymbol} LP tokens.`
:`The swap creator is offering ${lpTokenAmount} ${lpTokenSymbol} LP token and is asking for ${exTokenAmount} ${exTokenSymbol} LP tokens.`