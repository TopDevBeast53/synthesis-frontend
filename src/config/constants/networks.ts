import { CHAIN_CONFIG } from "utils/types"
import { ChainId } from 'sdk'

export const CHAIN_IDS_TO_NAMES = {
    [ChainId.MAINNET]: 'mainnet',
    [ChainId.TESTNET]: 'rinkeby',
    [ChainId.RSK_MAINNET]: 'bitcoin_rsk',
    [ChainId.RSK_TESTNET]: 'rsk_testnet',
    [ChainId.BSC_MAINNET]: 'bsc',
    [ChainId.BSC_TESTNET]: 'bsc_testnet',
    [ChainId.OKC_MAINNET]: 'okc'
}

export const SUPPORTED_NETWORKS: { [key: number]: CHAIN_CONFIG } = {
    [ChainId.MAINNET]: {
        chainId: 1,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.MAINNET],
        chainNameForMetamask: "Ethereum Mainnet",
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/VqUJXhZEYxUqofUHG6UWgxbuD3tw3yCf'],
        rpcUrlsForMetamask: ['https://mainnet.infura.io/v3/'],
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
        chainNameForMetamask: "Rinkeby Testnet",
        nativeCurrency: {
            name: 'Rinkeby Ethereum',
            symbol: 'rETH',
            decimals: 18,
        },
        rpcUrls: ['https://eth-rinkeby.alchemyapi.io/v2/qDpaVG0RqZ6J9JQlq9zJb-yEIgP0HifU'],
        rpcUrlsForMetamask: ['https://rinkeby.infura.io/v3/'],
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
        chainNameForMetamask: "RSK Mainnet",
        nativeCurrency: {
            name: 'RSK Smart Bitcoin',
            symbol: 'RBTC',
            decimals: 18,
        },
        rpcUrls: ['https://rsk.getblock.io/mainnet/78baefd8-efa7-420f-8a4c-8e1cd66a8353/'],
        rpcUrlsForMetamask: ['https://public-node.rsk.co'],
        blockExplorerUrls: ['https://explorer.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'Bitcoin RSK',
        showOnlyTrade: true,
        isTestChain: false
    },
    [ChainId.RSK_TESTNET]: {
        chainId: 31,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.RSK_TESTNET],
        chainNameForMetamask: "RSK Testnet",
        nativeCurrency: {
            name: 'Test RSK Smart Bitcoin',
            symbol: 'tRBTC',
            decimals: 18,
        },
        rpcUrls: ['https://public-node.testnet.rsk.co'],
        rpcUrlsForMetamask: ['https://public-node.testnet.rsk.co'],
        blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
        logoUrl: '/images/networks/rsk-network.jpg',
        label: 'RSK Testnet',
        showOnlyTrade: true,
        isTestChain: true
    },
    [ChainId.BSC_MAINNET]: {
        chainId: 56,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.BSC_MAINNET],
        chainNameForMetamask: "BSC",
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://multi-polished-frog.bsc.quiknode.pro/a88df2a809c021090a74b62200b5cd2ba73a7bcb/'],
        rpcUrlsForMetamask: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com'],
        logoUrl: '/images/networks/bnb-network.png',
        label: 'BSC',
        showOnlyTrade: true,
        isTestChain: false
    },
    [ChainId.BSC_TESTNET]: {
        chainId: 97,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.BSC_TESTNET],
        chainNameForMetamask: "BSC Testnet",
        nativeCurrency: {
            name: 'Test BNB',
            symbol: 'tBNB',
            decimals: 18,
        },
        rpcUrls: ['https://sleek-red-patina.bsc-testnet.quiknode.pro/4bb5df7d53d77afb1de5c12aba9ab66a2b993520/'],
        rpcUrlsForMetamask: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
        logoUrl: '/images/networks/bnb-network.jpg',
        label: 'BSC Testnet',
        showOnlyTrade: true,
        isTestChain: true
    },
    [ChainId.OKC_MAINNET]: {
        chainId: 66,
        chainName: CHAIN_IDS_TO_NAMES[ChainId.OKC_MAINNET],
        chainNameForMetamask: "OKExChain",
        nativeCurrency: {
            name: 'OKT',
            symbol: 'OKT',
            decimals: 18,
        },
        rpcUrls: ['https://exchainrpc.okex.org/'],
        rpcUrlsForMetamask: ['https://exchainrpc.okex.org/'],
        blockExplorerUrls: ['https://www.oklink.com/en/okc/'],
        logoUrl: '/images/networks/okc.png',
        label: 'OKC',
        showOnlyTrade: true,
        isTestChain: false
    }
}
