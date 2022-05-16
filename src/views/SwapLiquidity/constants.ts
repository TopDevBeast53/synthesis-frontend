import { getHelixLPSwapAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

export const lpSwapAddress = getHelixLPSwapAddress()

export const ToolTipText = (lpTokenSymbol, lpTokenAmount, exTokenSymbol, exTokenAmount) =>
    `The swap creator is offering ${getBalanceNumber(lpTokenAmount)} ${lpTokenSymbol} LP token and is asking for ${getBalanceNumber(exTokenAmount)} ${exTokenSymbol} LP token.`