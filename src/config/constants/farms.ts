import { ChainId } from 'sdk'
import { serializeTokensMainNet, serializeTokensRSKMainNet, serializeTokensRSKTestNet, serializeTokensTestNet } from './tokens'
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
        default:
            return getFarmsRSKTestNet()

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
            pid: 7,
            lpSymbol: 'TRIBE-FEI',
            lpAddress: '0x54427EaCC21A1C96a239cf65C33be61CF616EdBF',
            token: serializedTokens.tribe,
            quoteToken: serializedTokens.fei,
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
            lpSymbol: 'RHELIX-WRBTC',
            lpAddress: '0x792Ba36a0dF41141072A04C4485E393EC8dD7129',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 2,
            lpSymbol: 'RHELIX-RUSDT',
            lpAddress: '0xb7190921ec3082d8227b02dC95A2d6f5b4AFCcDC',
            token: serializedTokens.helix,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 3,
            lpSymbol: 'RUSDT-WRBTC',
            lpAddress: '0x810b968858233e4F2873295D409f4E91998207CE',
            token: serializedTokens.weth,
            quoteToken: serializedTokens.usdt,
        },
        {
            pid: 4,
            lpSymbol: 'RIF-WRBTC',
            lpAddress: '0xa38B0DEB3d32673dC2CF4bE1B3af8233048A263E',
            token: serializedTokens.rif,
            quoteToken: serializedTokens.weth,
        },
        {
            pid: 5,
            lpSymbol: 'SOV-WRBTC',
            lpAddress: '0x5863A6b17B8F2898B08c92ba2CBBAdfD8C588812',
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
        // {
        //     pid: 1,
        //     lpSymbol: 'RHELIX-WRBTC',
        //     lpAddress: '0x792Ba36a0dF41141072A04C4485E393EC8dD7129',
        //     token: serializedTokens.helix,
        //     quoteToken: serializedTokens.weth,
        // },
        // {
        //     pid: 2,
        //     lpSymbol: 'RHELIX-RUSDT',
        //     lpAddress: '0xb7190921ec3082d8227b02dC95A2d6f5b4AFCcDC',
        //     token: serializedTokens.helix,
        //     quoteToken: serializedTokens.usdt,
        // },
        // {
        //     pid: 3,
        //     lpSymbol: 'RUSDT-WRBTC',
        //     lpAddress: '0x810b968858233e4F2873295D409f4E91998207CE',
        //     token: serializedTokens.weth,
        //     quoteToken: serializedTokens.usdt,
        // },
        // {
        //     pid: 4,
        //     lpSymbol: 'RIF-WRBTC',
        //     lpAddress: '0xa38B0DEB3d32673dC2CF4bE1B3af8233048A263E',
        //     token: serializedTokens.rif,
        //     quoteToken: serializedTokens.weth,
        // },
        // {
        //     pid: 5,
        //     lpSymbol: 'SOV-WRBTC',
        //     lpAddress: '0x5863A6b17B8F2898B08c92ba2CBBAdfD8C588812',
        //     token: serializedTokens.sov,
        //     quoteToken: serializedTokens.weth,
        // },
    ]
}

export default getFarms
