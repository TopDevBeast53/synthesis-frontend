import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from 'sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId): Token | undefined {
    return chainId && currency === ETHER[chainId] ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
    currencyAmount: CurrencyAmount | undefined,
    chainId: ChainId,
): TokenAmount | undefined {
    const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
    return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token, chainId: ChainId): Currency {
    if (token.equals(WETH[token.chainId])) return ETHER[chainId]
    return token
}
