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
    [ChainId.MAINNET]: 'https://etherscan.io',
    [ChainId.TESTNET]: 'https://rinkeby.etherscan.io',
    [ChainId.RSK_MAINNET]: 'https://explorer.rsk.co',
    [ChainId.RSK_TESTNET]: 'https://explorer.testnet.rsk.co',
    [ChainId.BSC_MAINNET]: 'https://bscscan.com',
    [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
    [ChainId.OKC_MAINNET]: 'https://www.oklink.com/en/okc',
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
    [ChainId.BSC_MAINNET]: 3,
    [ChainId.BSC_TESTNET]: 3,
    [ChainId.OKC_MAINNET]: 3.8,
}
export const HELIX_PER_BLOCK = {
    [ChainId.MAINNET]: 4.5,
    [ChainId.TESTNET]: 4.5,
    [ChainId.RSK_MAINNET]: 5.625,
    [ChainId.RSK_TESTNET]: 5.625,
    [ChainId.BSC_MAINNET]: 0.3375,
    [ChainId.BSC_TESTNET]: 0.3375,
    [ChainId.OKC_MAINNET]: 0.16875,
}
export const BLOCKS_PER_YEAR = {
    [ChainId.MAINNET]: (60 / BLOCK_TIME[ChainId.MAINNET]) * 60 * 24 * 365,
    [ChainId.TESTNET]: (60 / BLOCK_TIME[ChainId.TESTNET]) * 60 * 24 * 365,
    [ChainId.RSK_MAINNET]: (60 / BLOCK_TIME[ChainId.RSK_MAINNET]) * 60 * 24 * 365,
    [ChainId.RSK_TESTNET]: (60 / BLOCK_TIME[ChainId.RSK_TESTNET]) * 60 * 24 * 365,
    [ChainId.BSC_MAINNET]: (60 / BLOCK_TIME[ChainId.BSC_MAINNET]) * 60 * 24 * 365,
    [ChainId.BSC_TESTNET]: (60 / BLOCK_TIME[ChainId.BSC_TESTNET]) * 60 * 24 * 365,
    [ChainId.OKC_MAINNET]: (60 / BLOCK_TIME[ChainId.OKC_MAINNET]) * 60 * 24 * 365,
}  // 10512000
export const HELIX_PER_YEAR = {
    [ChainId.MAINNET]: HELIX_PER_BLOCK[ChainId.MAINNET] * BLOCKS_PER_YEAR[ChainId.MAINNET],
    [ChainId.TESTNET]: HELIX_PER_BLOCK[ChainId.TESTNET] * BLOCKS_PER_YEAR[ChainId.TESTNET],
    [ChainId.RSK_MAINNET]: HELIX_PER_BLOCK[ChainId.RSK_MAINNET] * BLOCKS_PER_YEAR[ChainId.RSK_MAINNET],
    [ChainId.RSK_TESTNET]: HELIX_PER_BLOCK[ChainId.RSK_TESTNET] * BLOCKS_PER_YEAR[ChainId.RSK_TESTNET],
    [ChainId.BSC_MAINNET]: HELIX_PER_BLOCK[ChainId.BSC_MAINNET] * BLOCKS_PER_YEAR[ChainId.BSC_MAINNET],
    [ChainId.BSC_TESTNET]: HELIX_PER_BLOCK[ChainId.BSC_TESTNET] * BLOCKS_PER_YEAR[ChainId.BSC_TESTNET],
    [ChainId.OKC_MAINNET]: HELIX_PER_BLOCK[ChainId.OKC_MAINNET] * BLOCKS_PER_YEAR[ChainId.OKC_MAINNET],
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
export const VOTING_SNAPSHOT_SPACE = {
    [ChainId.MAINNET]: 'helixgeometry.eth',
    [ChainId.TESTNET]: 'silverstardev.eth',
    [ChainId.RSK_MAINNET]: 'helixgeometryrsk.eth',
    [ChainId.RSK_TESTNET]: 'helixgeomtryrsktest.eth',
    [ChainId.BSC_MAINNET]: 'helixgeometrybsc.eth',
    [ChainId.BSC_TESTNET]: 'helixgeometrybsctest.eth'
}