import invariant from 'tiny-invariant'
import { ChainId } from '../constants'
import { validateAndParseAddress } from '../utils'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
    public readonly chainId: ChainId

    public readonly address: string

    public readonly projectLink?: string

    public constructor(
        chainId: ChainId,
        address: string,
        decimals: number,
        symbol?: string,
        name?: string,
        projectLink?: string,
    ) {
        super(decimals, symbol, name)
        this.chainId = chainId
        this.address = validateAndParseAddress(address)
        this.projectLink = projectLink
    }

    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    public equals(other: Token): boolean {
        // short circuit on reference equality
        if (this === other) {
            return true
        }
        return this.chainId === other.chainId && this.address === other.address
    }

    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    public sortsBefore(other: Token): boolean {
        invariant(this.chainId === other.chainId, 'CHAIN_IDS')
        invariant(this.address !== other.address, 'ADDRESSES')
        return this.address.toLowerCase() < other.address.toLowerCase()
    }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
    if (currencyA instanceof Token && currencyB instanceof Token) {
        return currencyA.equals(currencyB)
    }

    if (currencyA instanceof Token) {
        return false
    }

    if (currencyB instanceof Token) {
        return false
    }

    return currencyA === currencyB
}

export const WETH = {
    [ChainId.MAINNET]: new Token(
        ChainId.MAINNET,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // update me
        18,
        'WETH',
        'Wrapped ETH',
        'https://www.ethereum.org/',
    ),
    [ChainId.TESTNET]: new Token(
        ChainId.TESTNET,
        '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        18,
        'WETH',
        'Wrapped ETH',
        'https://www.ethereum.org/',
    ),
    [ChainId.RSK_MAINNET]: new Token(
        ChainId.RSK_MAINNET,
        '0x967f8799af07df1534d48a95a5c9febe92c53ae0',
        18,
        'WRBTC',
        'Wrapped RSK Bitcoin',
        'https://www.rsk.co/',
    ),
    [ChainId.RSK_TESTNET]: new Token(
        ChainId.RSK_TESTNET,
        '0xd07445d75A1A18A0030Bf7786990F3C1Ee71dB6e',
        18,
        'WRBTC',
        'Wrapped RSK Bitcoin',
        'https://www.rsk.co/',
    ),
}

// export const WRBTC = {
//     [ChainId.RSK_MAINNET]: new Token(
//         ChainId.RSK_MAINNET,
//         '0x967f8799aF07DF1534d48A95a5C9FEBE92c53ae0', // update me
//         18,
//         'WRBTC',
//         'Wrapped RBTC',
//         'https://www.rsk.co/',
//     ),
//     [ChainId.RSK_TESTNET]: new Token(
//         ChainId.RSK_TESTNET,
//         '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//         18,
//         'tWRBTC',
//         'Wrapped uWBTC',
//         'https://www.rsk.org/',
//     ),
// }
