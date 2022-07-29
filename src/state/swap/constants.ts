import { ChainId } from 'sdk'

// HELIX
export const DEFAULT_INPUT_CURRENCY = {
    [ChainId.MAINNET]: '0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980',
    [ChainId.TESTNET]: '0x79DD2dad8D04F9279F94580DBEd2306A0aE118Bd',
    [ChainId.RSK_MAINNET]: '0x3D2441Fa9Aab621e72121fb1c620FDAE59eAe812',
    [ChainId.RSK_TESTNET]: '0x08626CF6A212a44C877D9740f86252dBD6292364',
}

// USDC
export const DEFAULT_OUTPUT_CURRENCY = {
    [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [ChainId.TESTNET]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    [ChainId.RSK_MAINNET]: '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96',
    [ChainId.RSK_TESTNET]: '0x760ae0f5319D9efEdc9B99d7E73fdaB2f84E4d87',
}
