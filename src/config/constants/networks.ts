import { CHAIN_CONFIG } from "utils/types"

enum CHAIN_NAME {
    MAINNET = "ethereum",
    RINKEBY = "rinkeby",
    RSK_MAINNET = "rsk_mainnet",
    RSK_TESTNET = "rsk_testnet"
}

const NETWORK_CONFIGS: { [chainName in CHAIN_NAME]: CHAIN_CONFIG } = {
    [CHAIN_NAME.MAINNET]: {
        CHAIN_ID: 1,
        NODE_URL: "https://eth-mainnet.g.alchemy.com/v2/VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf",
    },
    [CHAIN_NAME.RINKEBY]: {
        CHAIN_ID: 4,
        NODE_URL: "https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU"
    },
    [CHAIN_NAME.RSK_MAINNET]: {
        CHAIN_ID: 4,
        NODE_URL: "https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU",
    },
    [CHAIN_NAME.RSK_TESTNET]: {
        CHAIN_ID: 4,
        NODE_URL: "https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU"
    }
}

/**
 * List of all the networks supported by the Helix Exchange Interface
 */
export enum SupportedChainId {
    MAINNET = 1,
    RINKEBY = 4,
    RSK_MAINNET = 4,
    RSK_TESTNET = 4,
}

export const CHAIN_IDS_TO_NAMES = {
    [SupportedChainId.MAINNET]: 'mainnet',
    [SupportedChainId.RINKEBY]: 'rinkeby',
    [SupportedChainId.RSK_MAINNET]: 'rsk_mainnet',
    [SupportedChainId.RSK_TESTNET]: 'rsk_testnet',
}

export const SUPPORTED_NETWORKS: Record<
    number,
    {
        chainId: string
        chainName: string
        nativeCurrency: {
            name: string
            symbol: string
            decimals: number
        }
        rpcUrls: string[]
        blockExplorerUrls: string[]
        logoUrl: string
        label: string
    }
> = {
    [SupportedChainId.MAINNET]: {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3'],
        blockExplorerUrls: ['https://etherscan.com'],
        logoUrl: '/images/networks/mainnet-network.jpg',
        label: 'Ethereum',
    },
    [SupportedChainId.RINKEBY]: {
        chainId: '0x4',
        chainName: 'Rinkeby',
        nativeCurrency: {
            name: 'Rinkeby Ethereum',
            symbol: 'rETH',
            decimals: 18,
        },
        rpcUrls: ['https://rinkeby.infura.io/v3/'],
        blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
        logoUrl: '/images/networks/rinkeby-network.jpg',
        label: 'Rinkeby',
    },
    [SupportedChainId.RSK_MAINNET]: {
        chainId: '0x1E',
        chainName: 'RSK Mainnet',
        nativeCurrency: {
            name: 'RSK Smart Bitcoin',
            symbol: 'RBTC',
            decimals: 18,
        },
        rpcUrls: ['https://public-node.rsk.co'],
        blockExplorerUrls: ['https://explorer.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'RSK Mainnet',
    },
    [SupportedChainId.RSK_TESTNET]: {
        chainId: '0x1E',
        chainName: 'RSK Testnet',
        nativeCurrency: {
            name: 'Test RSK Smart Bitcoin',
            symbol: 'tRBTC',
            decimals: 18,
        },
        rpcUrls: ['https://public-node.testnet.rsk.co'],
        blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'RSK Testnet',
    },
}

export default NETWORK_CONFIGS
