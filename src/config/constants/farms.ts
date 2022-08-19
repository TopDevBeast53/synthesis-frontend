import { ChainId } from 'sdk'
import {
    serializeTokensMainNet,
    serializeTokensRSKMainNet,
    serializeTokensRSKTestNet,
    serializeTokensTestNet,
    serializeTokensBSCMainNet,
    serializeTokensBSCTestNet,
    serializeTokensOKCMainNet,
} from './tokens'
import { SerializedFarmConfig } from './types'

const getFarms = (chainId: ChainId): SerializedFarmConfig[] => {
    switch (chainId) {
        case ChainId.MAINNET:
            return getFarmsMainNet()
        case ChainId.TESTNET:
            return getFarmsTestNet()
        case ChainId.RSK_MAINNET:
            return getFarmsRSKMainNet()
        case ChainId.RSK_TESTNET:
            return getFarmsRSKTestNet()
        case ChainId.BSC_MAINNET:
            return getFarmsBSCMainNet()
        case ChainId.BSC_TESTNET:
            return getFarmsBSCTestNet()
        case ChainId.OKC_MAINNET:
            return getFarmsOKCMainNet()
        default:
            return []
    }
}

const getFarmsMainNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensMainNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WETH',
            lpAddress: '0xc6f47e4eb14b421c3ae0984141bE9cF3793bDe93',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 11,
            lpSymbol: 'HELIX-USDC',
            lpAddress: '0x5442eaa8b522e1A4eee64d441c5a6243baF83f0C',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 2,
            lpSymbol: 'DAI-USDC',
            lpAddress: '0x42Aae775D55cD2a38C216833f2Ee86dE970d320B',
            token: serializedTokens.dai,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 3,
            lpSymbol: 'USDC-WETH',
            lpAddress: '0x110548598Bf0221a56B11850B14F867867689CD6',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 4,
            lpSymbol: 'DAI-WETH',
            lpAddress: '0x08dd9604D467674BFd1dE4FfF83848166628f90F',
            token: serializedTokens.dai,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 5,
            lpSymbol: 'USDT-USDC',
            lpAddress: '0x2a78aFdD764ff1cCdAaab5fCaB78B701B1c967DE',
            token: serializedTokens.usdt,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 6,
            lpSymbol: 'WBTC-WETH',
            lpAddress: '0x8265A7745D0501915DEBC1fF72e049Bd989CaF7f',
            token: serializedTokens.wbtc,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 15,
            lpSymbol: 'FRAX-USDC',
            lpAddress: '0xB53BEFA8578d15386f08cAc43066098eA62bec09',
            token: serializedTokens.frax,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 8,
            lpSymbol: 'FXS-FRAX',
            lpAddress: '0x4E467fB2E874A5A6C826Dcf0A4707c5Ce431f336',
            token: serializedTokens.fxs,
            quoteToken: serializedTokens.frax,
        },
        {
            pid: 9,
            lpSymbol: 'BADGER-HELIX',
            lpAddress: '0x57818FF3e6eCcE616095B0F3D513FeB8C6C81Fe7',
            token: serializedTokens.badger,
            quoteToken: serializedTokens.helix,
        },
        {
            pid: 10,
            lpSymbol: 'APE-HELIX',
            lpAddress: '0x7b19B5725Bcc0d88101616a1484a087DbA7c17B4',
            token: serializedTokens.ape,
            quoteToken: serializedTokens.helix,
        },
        {
            pid: 12,
            lpSymbol: 'CULT-WETH',
            lpAddress: '0x200e1e20eb37Fcd175A96A432292bf2AbA71B1e4',
            token: serializedTokens.cult,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 7,
            lpSymbol: 'TRIBE-FEI',
            lpAddress: '0x54427EaCC21A1C96a239cf65C33be61CF616EdBF',
            token: serializedTokens.tribe,
            quoteToken: serializedTokens.fei,
        },
        {
            pid: 16,
            lpSymbol: 'TRIBE-HELIX',
            lpAddress: '0xcaD466fcad58a825FF886a317Be6C57ff79a6e12',
            token: serializedTokens.tribe,
            quoteToken: serializedTokens.helix,
        },
        {
            pid: 13,
            lpSymbol: 'BOND-USDC',
            lpAddress: '0x7565756FEaec1cBf51dFE71E04720b13F1C5104D',
            token: serializedTokens.bond,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 14,
            lpSymbol: 'BAL-HELIX',
            lpAddress: '0x6d940051f0fD76B4dE73fAc9DB8336b47F967bb1',
            token: serializedTokens.bal,
            quoteToken: serializedTokens.helix,
        },
    ]
}

const getFarmsTestNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensTestNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WETH',
            lpAddress: '0x4d762164f26DbfD16634fe933D1f6C7f72f08531',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'DAI-USDC',
            lpAddress: '0xB761cAb861Ba423239E852b7d628c5a14A6fb474',
            token: serializedTokens.dai,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 3,
            lpSymbol: 'USDC-WETH',
            lpAddress: '0x8354fA5b6941b2ca5aD014aB56E69646bf4292F5',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 4,
            lpSymbol: 'DAI-WETH',
            lpAddress: '0xaE25d607bB327A7353dbbbdFFc234Cbd3a0E9b29',
            token: serializedTokens.dai,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 5,
            lpSymbol: 'USDT-USDC',
            lpAddress: '0xd87e648ccca6C944FA1A0aACDb4d0577518323f3',
            token: serializedTokens.usdt,
            quoteToken: serializedTokens.usdc,
        },
    ]
}

const getFarmsRSKTestNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensRSKTestNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WRBTC',
            lpAddress: '0x6eb232eddf627b813466378d302892707ae6f258',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'HELIX-rUSDT',
            lpAddress: '0xba05fa8f617c548df8e9dfaaaee43999a5e80e17',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 3,
            lpSymbol: 'rUSDT-WRBTC',
            lpAddress: '0xf4c84130f8e52acf8aa33a64b9b2b7cd15313725',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 4,
            lpSymbol: 'RIF-WRBTC',
            lpAddress: '0xd05312f95a0cd6c6a38cab7b4acb8a63a9637fa9',
            token: serializedTokens.rif,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 5,
            lpSymbol: 'SOV-WRBTC',
            lpAddress: '0xcef4cb9f0afd27d857b16e813e83a4fc3f480daa',
            token: serializedTokens.sov,
            quoteToken: serializedTokens.weth,
        },
    ]
}

const getFarmsRSKMainNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensRSKMainNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WRBTC',
            lpAddress: '0x81b255faa5828ed50e1b00f4d3b815a5085a1dae',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'HELIX-rUSDT',
            lpAddress: '0xeb882f7105fbfb21344460e67de46a24c5df8c1a',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 3,
            lpSymbol: 'rUSDT-WRBTC',
            lpAddress: '0xfe426a0f3d44f92cecef45d495185c3dd23f49d4',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 4,
            lpSymbol: 'RIF-WRBTC',
            lpAddress: '0x0c80ccc24e21a8376d39924e4ec0dd1f54fda367',
            token: serializedTokens.rif,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 5,
            lpSymbol: 'SOV-WRBTC',
            lpAddress: '0x57c3d1e11d79bb117997be1ab861f6d6768e7b63',
            token: serializedTokens.sov,
            quoteToken: serializedTokens.weth,
        },
    ]
}

const getFarmsBSCMainNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensBSCMainNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WBNB',
            lpAddress: '0xe3B4C21856153Ef65b8BfBaEb9ca18282c4535e7',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'HELIX-BUSD',
            lpAddress: '0xbA4BF3A8aa1F566B29F7d13C6fE410D9A6F0cC61',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.busd,
        },
        {
            pid: 3,
            lpSymbol: 'WBNB-BUSD',
            lpAddress: '0x4258bE0fD967DbFc6D19955828a27cB6D8Ba9344',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.busd,
        },
        {
            pid: 4,
            lpSymbol: 'USDC-BUSD',
            lpAddress: '0x53E5f05ee4fb500D0dc1f8c32b947952a1114be1',
            token: serializedTokens.usdc,
            quoteToken: serializedTokens.busd,
        },
        {
            pid: 5,
            lpSymbol: 'USDT-BUSD',
            lpAddress: '0x47BF097Aa893c02C23c76774FbBDeb7AF693ce8a',
            token: serializedTokens.usdt,
            quoteToken: serializedTokens.busd,
        },
        {
            pid: 6,
            lpSymbol: 'USDC-USDT',
            lpAddress: '0x795839bdE85dadEeb38f9B988E34afF1F20dA063',
            token: serializedTokens.usdc,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 7,
            lpSymbol: 'USDC-WBNB',
            lpAddress: '0x6D6480E533455aF9112C47E8feD2b8810e78b29D',
            token: serializedTokens.usdc,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 8,
            lpSymbol: 'CAKE-WBNB',
            lpAddress: '0x45A83465940195AAD94fb0734D4AEc08A35C5bf0',
            token: serializedTokens.cake,
            quoteToken: serializedTokens.weth,
        },
    ]
}

const getFarmsBSCTestNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensBSCTestNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
    ]
}

const getFarmsOKCMainNet = (): SerializedFarmConfig[] => {
    const serializedTokens = serializeTokensOKCMainNet()
    return [
        {
            pid: 0,
            lpSymbol: 'HELIX',
            lpAddress: serializedTokens.helix.address,
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 1,
            lpSymbol: 'HELIX-WOKT',
            lpAddress: '0xD871238f5BD2a1e8ba935b716e664f6518A96CA1',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'HELIX-USDC',
            lpAddress: '0x24ACF2545a13e02c6dA0933A866b5f16b1ad0d46',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 3,
            lpSymbol: 'WOKT-USDC',
            lpAddress: '0xaE78F8b1FdD0269dAfaaC1031cB899ee453b4f19',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 4,
            lpSymbol: 'USDT-USDC',
            lpAddress: '0x5CE7d045C55523Dbfa6eEC200E81fCE665358409',
            token: serializedTokens.usdt,
            quoteToken: serializedTokens.usdc,
        },
        {
            pid: 5,
            lpSymbol: 'CHE-WOKT',
            lpAddress: '0x8ca827dA72C915Ddd86094329aE274201C9b93Bc',
            token: serializedTokens.che,
            quoteToken: serializedTokens.weth,
        },
    ]
}

export default getFarms
