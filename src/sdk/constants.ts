import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
    MAINNET = 3,    // UpdateMe
    TESTNET = 4,
}

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT,
}

export enum Rounding {
    ROUND_DOWN,
    ROUND_HALF_UP,
    ROUND_UP,
}

export const FACTORY_ADDRESS = '0xa21336F61E8dA10D5bAC1aBE4AD787b61870F343' // UpdateMe

export const INIT_CODE_HASH = '0xaa7f6a54c89269d994ced2ff5fd7b66d5ae4ae3e9a075f567db3315fc768a8b2'  // UpdateMe

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const FEES_NUMERATOR = JSBI.BigInt(9975)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
    uint8 = 'uint8',
    uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
    [SolidityType.uint8]: JSBI.BigInt('0xff'),
    [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}
