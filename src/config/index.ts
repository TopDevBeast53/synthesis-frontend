import { ChainId } from 'sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
})

/**
 * Block Explorer URLs
 */
export const BASE_ETH_SCAN_URLS = {
    [ChainId.MAINNET]: 'https://etherscan.io',  // UpdateMe https://etherscan.io
    [ChainId.TESTNET]: 'https://rinkeby.etherscan.io',
    [ChainId.RSK_MAINNET]: 'https://explorer.rsk.co',
    [ChainId.RSK_TESTNET]: 'https://explorer.testnet.rsk.co',
}

export const BASE_SOLANA_SCAN_URLS = 'https://explorer.solana.com/'

/**
 * HELIX_PER_BLOCK details
 */

export const BLOCK_TIME = {
    [ChainId.MAINNET]: 13.4,
    [ChainId.TESTNET]: 13.4,
    [ChainId.RSK_MAINNET]: 34,
    [ChainId.RSK_TESTNET]: 34,
}
export const HELIX_PER_BLOCK = {
    [ChainId.MAINNET]: 4.5,
    [ChainId.TESTNET]: 4.5,
    [ChainId.RSK_MAINNET]: 5.625,
    [ChainId.RSK_TESTNET]: 5.625,
}
export const BLOCKS_PER_YEAR = {
    [ChainId.MAINNET]: (60 / BLOCK_TIME[ChainId.MAINNET]) * 60 * 24 * 365,
    [ChainId.TESTNET]: (60 / BLOCK_TIME[ChainId.TESTNET]) * 60 * 24 * 365,
    [ChainId.RSK_MAINNET]: (60 / BLOCK_TIME[ChainId.RSK_MAINNET]) * 60 * 24 * 365,
    [ChainId.RSK_TESTNET]: (60 / BLOCK_TIME[ChainId.RSK_TESTNET]) * 60 * 24 * 365,
}  // 10512000
export const HELIX_PER_YEAR = {
    [ChainId.MAINNET]: HELIX_PER_BLOCK[ChainId.MAINNET] * BLOCKS_PER_YEAR[ChainId.MAINNET],
    [ChainId.TESTNET]: HELIX_PER_BLOCK[ChainId.TESTNET] * BLOCKS_PER_YEAR[ChainId.TESTNET],
    [ChainId.RSK_MAINNET]: HELIX_PER_BLOCK[ChainId.RSK_MAINNET] * BLOCKS_PER_YEAR[ChainId.RSK_MAINNET],
    [ChainId.RSK_TESTNET]: HELIX_PER_BLOCK[ChainId.RSK_TESTNET] * BLOCKS_PER_YEAR[ChainId.RSK_TESTNET],
}
export const BASE_URL = 'https://helix.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 380000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
// In reality its 10000 because of fast refresh, a bit less here to cover for possible long request times
export const PANCAKE_BUNNIES_UPDATE_FREQUENCY = 8000

/**
 * Voting page
 */
export const VOTING_SUBGRAPH_PATH = {
    [ChainId.MAINNET]: "qiangkaiwen/helix",
    [ChainId.TESTNET]: "qiangkaiwen/helix-rinkeby"
}

export const VOTING_SNAPSHOT_SPACE = {
    [ChainId.MAINNET]: 'helixgeometry.eth',
    [ChainId.TESTNET]: 'silverstardev.eth',
    [ChainId.RSK_MAINNET]: 'helixgeometryrsk.eth',
    [ChainId.RSK_TESTNET]: 'helixgeomtryrsktest.eth',
    // [ChainId.BSC_MAINNET]: 'helixgeomtrybsc.eth',
    // [ChainId.BSC_TESTNET]: 'helixgeomtrybsctest.eth'
}