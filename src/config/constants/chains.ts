/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.RINKEBY]: 'rinkeby',
}
