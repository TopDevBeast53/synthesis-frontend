import { ChainId } from 'sdk'

// HELIX
const chainId = process.env.REACT_APP_CHAIN_ID

export const DEFAULT_INPUT_CURRENCY = Number(chainId) === ChainId.MAINNET ? '0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980' : '0x79DD2dad8D04F9279F94580DBEd2306A0aE118Bd' // update me

// USDC
export const DEFAULT_OUTPUT_CURRENCY = Number(chainId) === ChainId.MAINNET ? '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' : '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b' // update me
