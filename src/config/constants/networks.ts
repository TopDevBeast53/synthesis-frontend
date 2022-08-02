import { CHAIN_CONFIG } from "utils/types"
import { ChainId } from 'sdk'

export const CHAIN_IDS_TO_NAMES = {
    [ChainId.MAINNET]: 'mainnet',
    [ChainId.TESTNET]: 'rinkeby',
    [ChainId.RSK_MAINNET]: 'bitcoin_rsk',
    [ChainId.RSK_TESTNET]: 'rsk_testnet',
}

export const SUPPORTED_NETWORKS: { [key: number]: CHAIN_CONFIG } = {
    [ChainId.MAINNET]: {
        chainId: 1,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.MAINNET],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf'],
        blockExplorerUrls: ['https://etherscan.com'],
        logoUrl: '/images/networks/mainnet-network.jpg',
        label: 'Ethereum',
        showOnlyTrade: false,
        isTestChain: false,
        apiKey: "VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf"
    },
    [ChainId.TESTNET]: {
        chainId: 4,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.TESTNET],
        nativeCurrency: {
            name: 'Rinkeby Ethereum',
            symbol: 'rETH',
            decimals: 18,
        },
        rpcUrls: ['https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU'],
        blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
        logoUrl: '/images/networks/rinkeby-network.jpg',
        label: 'Rinkeby',
        showOnlyTrade: false,
        isTestChain: true,
        apiKey: "VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf"
    },
    [ChainId.RSK_MAINNET]: {
        chainId: 30,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.RSK_MAINNET],
        nativeCurrency: {
            name: 'RSK Smart Bitcoin',
            symbol: 'RBTC',
            decimals: 18,
        },
        rpcUrls: ['https://rsk.getblock.io/mainnet/78baefd8-efa7-420f-8a4c-8e1cd66a8353'],
        blockExplorerUrls: ['https://explorer.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'Bitcoin RSK',
        showOnlyTrade: true,
        isTestChain: false
    },
    [ChainId.RSK_TESTNET]: {
        chainId: 31,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.RSK_TESTNET],
        nativeCurrency: {
            name: 'Test RSK Smart Bitcoin',
            symbol: 'tRBTC',
            decimals: 18,
        },
        rpcUrls: ['https://public-node.testnet.rsk.co'],
        blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'RSK Testnet',
        showOnlyTrade: true,
        isTestChain: true
    },
}
