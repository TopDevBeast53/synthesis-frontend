import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
    MAINNET = 1,    // UpdateMe
    TESTNET = 4,
    RSK_MAINNET = 30,
    RSK_TESTNET = 31,
    BSC_MAINNET = 56,
    BSC_TESTNET = 97,
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

export const FACTORY_ADDRESS = {
    [ChainId.MAINNET]: '0x8891Dd75ED91Fe531BC065882B579fFAE9a20284',
    [ChainId.TESTNET]: '0xa39E330b5d93eEb580867a60Beb34a525Bde1e2b',
    [ChainId.RSK_MAINNET]: '0x305f3bd2bf2425a8ba10588529b132f14d436a71',
    [ChainId.RSK_TESTNET]: '0x907c82508cFb215D564161A618e196b218E4f375',
    [ChainId.BSC_MAINNET]: '0x7e599C90C5D84DF399F8EfE3462a5F5C673c0ca8',
    [ChainId.BSC_TESTNET]: '0x510085FDBD2123d3753Aa61C495af7d863746c24',
}

export const INIT_CODE_HASH = {
    [ChainId.MAINNET]: '0xdf06dacc3c0f420f3e881baed6af2087e5ab8bc910d926f439c1081ec11fc885',
    [ChainId.TESTNET]: '0x368552104b0dcaacb939b1fe4370f68e358d806ee5d5c9a95193874dd004841a',
    [ChainId.RSK_MAINNET]: '0x039a6c55d612c34347963d19ff309e53bd5cd2c46f88b67b0f7f65d43193e92b',
    [ChainId.RSK_TESTNET]: '0x039a6c55d612c34347963d19ff309e53bd5cd2c46f88b67b0f7f65d43193e92b',
    [ChainId.BSC_MAINNET]: '0x039a6c55d612c34347963d19ff309e53bd5cd2c46f88b67b0f7f65d43193e92b',
    [ChainId.BSC_TESTNET]: '0x039a6c55d612c34347963d19ff309e53bd5cd2c46f88b67b0f7f65d43193e92b',
}

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
