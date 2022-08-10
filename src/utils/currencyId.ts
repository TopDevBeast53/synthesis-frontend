import { ChainId, Currency, ETHER, Token } from 'sdk'

export function currencyId(currency: Currency, chainId: ChainId): string {
    if (currency === ETHER[chainId]) return ETHER[chainId].symbol
    if (currency instanceof Token) return currency.address
    throw new Error('invalid currency')
}

export default currencyId
