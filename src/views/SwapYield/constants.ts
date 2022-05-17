import { getYieldSwapAddress } from 'utils/addressHelpers'

export const yieldSwapAddress = getYieldSwapAddress()

export const ToolTipText = (lpTokenSymbol, lpTokenAmount, exTokenSymbol, exTokenAmount) =>
    `The swap creator is offering ${lpTokenAmount} ${lpTokenSymbol} LP token and is asking for ${exTokenAmount} ${exTokenSymbol} LP token.`
