import { ChainId } from 'sdk'

export const GRAPH_API_PROFILE = process.env.REACT_APP_GRAPH_API_PROFILE
export const GRAPH_API_PREDICTION = process.env.REACT_APP_GRAPH_API_PREDICTION
export const GRAPH_API_LOTTERY = process.env.REACT_APP_GRAPH_API_LOTTERY
export const SNAPSHOT_VOTING_API = process.env.REACT_APP_SNAPSHOT_VOTING_API
export const SNAPSHOT_BASE_URL = process.env.REACT_APP_SNAPSHOT_BASE_URL
export const API_PROFILE = process.env.REACT_APP_API_PROFILE
export const API_NFT = process.env.REACT_APP_API_NFT
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`

/**
 * V1 will be deprecated but is still used to claim old rounds 
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction'

export const INFO_CLIENT = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/qiangkaiwen/helix',
    [ChainId.TESTNET]: 'https://api.thegraph.com/subgraphs/name/qiangkaiwen/helix-rinkeby',
    [ChainId.BSC_MAINNET]: 'https://api.thegraph.com/subgraphs/name/qiangkaiwen/helix-bsc'
}
export const BLOCKS_CLIENT = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    [ChainId.TESTNET]: 'https://api.thegraph.com/subgraphs/name/billjhlee/rinkeby-blocks',
    [ChainId.BSC_MAINNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
}
export const GRAPH_API_NFTMARKET = process.env.REACT_APP_GRAPH_API_NFT_MARKET
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const BRIDGE_BACKEND = 'https://192.64.83.201:5432/states/all'
