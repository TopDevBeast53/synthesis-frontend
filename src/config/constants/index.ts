import { ChainId, JSBI, Percent, Token } from 'sdk'
import { mainnetTokens, rskMainnetTokens, rskTestnetTokens, testnetTokens } from './tokens'

// a list of router addresses by chain
type RouterAddressesList = {
    readonly [chainId in ChainId]: string
}

export const ROUTER_ADDRESS: RouterAddressesList = {
    [ChainId.MAINNET]: '0x39D660d507f1bC34DbCe94831081D6cf9131c3b9',
    [ChainId.TESTNET]: '0x484621036C7D18EDE8A267C44e3FBfDfb81135af',
    [ChainId.RSK_MAINNET]: '0x3a9D41c8f905D1744180DA36B7EB8350A67cE8e4', // update me
    [ChainId.RSK_TESTNET]: '0x2E389edDB44933c46608bd0B0f4E9BeD191dCC90',
}

// a list of tokens by chain
type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    [ChainId.MAINNET]: [
        mainnetTokens.helix,
        mainnetTokens.weth,
        mainnetTokens.usdt,
        mainnetTokens.usdc,
    ],
    [ChainId.TESTNET]: [
        testnetTokens.weth,
        testnetTokens.helix,
        testnetTokens.usdc
    ],
    [ChainId.RSK_MAINNET]: [
        rskMainnetTokens.helix,
        rskMainnetTokens.weth,
        rskMainnetTokens.usdt
    ],
    [ChainId.RSK_TESTNET]: [
        rskTestnetTokens.helix,
        rskTestnetTokens.weth,
        rskTestnetTokens.usdt
    ],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.MAINNET]: {},
    [ChainId.TESTNET]: {},
    [ChainId.RSK_MAINNET]: {},
    [ChainId.RSK_TESTNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.MAINNET]: {},
    [ChainId.TESTNET]: {},
    [ChainId.RSK_MAINNET]: {},
    [ChainId.RSK_TESTNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
    [ChainId.MAINNET]: [
        mainnetTokens.weth,
        mainnetTokens.dai,
        mainnetTokens.usdt
    ],
    [ChainId.TESTNET]: [
        testnetTokens.weth,
        testnetTokens.dai,
        testnetTokens.usdc
    ],
    [ChainId.RSK_MAINNET]: [
        rskMainnetTokens.weth,
        rskMainnetTokens.usdt
    ],
    [ChainId.RSK_TESTNET]: [
        rskTestnetTokens.weth,
        rskTestnetTokens.usdt
    ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    [ChainId.MAINNET]: [
        mainnetTokens.weth,
        mainnetTokens.dai,
        mainnetTokens.usdc,
        mainnetTokens.usdt
    ],
    [ChainId.TESTNET]: [
        testnetTokens.weth,
        testnetTokens.dai,
        testnetTokens.usdc
    ],
    [ChainId.RSK_MAINNET]: [
        rskMainnetTokens.weth,
        rskMainnetTokens.usdt
    ],
    [ChainId.RSK_TESTNET]: [
        rskTestnetTokens.weth,
        rskTestnetTokens.usdt
    ],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
    [ChainId.MAINNET]: [],
    [ChainId.TESTNET]: [],
    [ChainId.RSK_MAINNET]: [],
    [ChainId.RSK_TESTNET]: [],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
    '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export { default as getFarms } from './farms'
export { default as getPools } from './pools'
export { default as ifosConfig } from './ifo'

// HELIX
export const DEFAULT_INPUT_CURRENCY = {
    [ChainId.MAINNET]: '0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980',
    [ChainId.TESTNET]: '0x79DD2dad8D04F9279F94580DBEd2306A0aE118Bd',
    [ChainId.RSK_MAINNET]: '0x3d2441fa9aab621e72121fb1c620fdae59eae812',
    [ChainId.RSK_TESTNET]: '0x08626CF6A212a44C877D9740f86252dBD6292364',
}

// USDC
export const DEFAULT_OUTPUT_CURRENCY = {
    [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [ChainId.TESTNET]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    [ChainId.RSK_MAINNET]: '0xef213441a85df4d7acbdae0cf78004e1e486bb96',
    [ChainId.RSK_TESTNET]: '0x760ae0f5319D9efEdc9B99d7E73fdaB2f84E4d87',
}
