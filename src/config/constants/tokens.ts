import { ChainId, Token } from 'sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const {
    MAINNET,
    TESTNET,
    RSK_MAINNET,
    RSK_TESTNET,
    BSC_MAINNET,
    BSC_TESTNET,
    OKC_MAINNET,
} = ChainId

interface TokenList {
    [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = defineTokens({
    // Update Me: update svg file name equal to the token address
    helix: new Token(
        MAINNET,
        '0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        MAINNET,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        18,
        'WETH',
        'Wrapped ETH',
        'https://www.ethereum.org/',
    ),
    dai: new Token(
        MAINNET,
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        18,
        'DAI',
        'Dai Stablecoin',
        'https://www.makerdao.com/',
    ),
    usdt: new Token(
        MAINNET,
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        6,
        'USDT',
        'Tether USD',
        'https://tether.to/',
    ),
    usdc: new Token(
        MAINNET,
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        6,
        'USDC',
        'USD Coin',
        'https://www.centre.io/usdc',
    ),
    wbtc: new Token(
        MAINNET,
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        8,
        'WBTC',
        'WBTC',
        'https://www.wbtc.network/',
    ),
    fei: new Token(
        MAINNET,
        '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
        18,
        'FEI',
        'FEI',
        'https://fei.money/',
    ),
    tribe: new Token(
        MAINNET,
        '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
        18,
        'TRIBE',
        'TRIBE',
        'https://fei.money/',
    ),
    fxs: new Token(
        MAINNET,
        '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
        18,
        'FXS',
        'FXS',
        'https://frax.finance/',
    ),
    frax: new Token(
        MAINNET,
        '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        18,
        'FRAX',
        'FRAX',
        'https://frax.finance',
    ),
    ape: new Token(
        MAINNET,
        '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
        18,
        'APE',
        'ApeCoin',
        'https://apecoin.com/',
    ),
    badger: new Token(
        MAINNET,
        '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
        18,
        'BADGER',
        'Badger',
        'https://badger.finance/',
    ),
    cult: new Token(
        MAINNET,
        '0xf0f9D895aCa5c8678f706FB8216fa22957685A13',
        18,
        'CULT',
        'Cult DAO',
        'https://cultdao.io/',
    ),
    bond: new Token(
        MAINNET,
        '0x0391D2021f89DC339F60Fff84546EA23E337750f',
        18,
        'BOND',
        'BarnBridge Governance Token',
        'https://barnbridge.com/',
    ),
    bal: new Token(
        MAINNET,
        '0xba100000625a3754423978a60c9317c58a424e3D',
        18,
        'BAL',
        'Balancer',
        'https://balancer.fi/',
    ),
} as const)

export const testnetTokens = defineTokens({
    helix: new Token(
        TESTNET,
        '0x79DD2dad8D04F9279F94580DBEd2306A0aE118Bd',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        TESTNET,
        '0xc778417E063141139Fce010982780140Aa0cD5Ab',
        18,
        'WETH',
        'Wrapped ETH',
        'https://www.ethereum.org/',
    ),
    usdc: new Token(
        TESTNET,
        '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
        6,
        'USDC',
        'USD Coin',
        'https://www.centre.io/usdc',
    ),
    usdt: new Token(
        TESTNET,
        '0x2a4a8B7555bDbBfef4a50E4E5c4Ed42C7A504Ce5',
        6,
        'USDT',
        'Tether USD',
        'https://tether.to/',
    ),
    dai: new Token(
        TESTNET,
        '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        18,
        'DAI',
        'Dai Stablecoin',
        'https://www.makerdao.com/',
    ),
} as const)

export const rskTestnetTokens = defineTokens({
    helix: new Token(
        RSK_TESTNET,
        '0x08626CF6A212a44C877D9740f86252dBD6292364',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        RSK_TESTNET,
        '0xd07445d75A1A18A0030Bf7786990F3C1Ee71dB6e',
        18,
        'WRBTC',
        'Wrapped RSK Bitcoin',
        'https://www.rsk.co/',
    ),
    usdt: new Token(
        RSK_TESTNET,
        '0x760ae0f5319D9efEdc9B99d7E73fdaB2f84E4d87',
        18,
        'rUSDT',
        'Wrapped RSK USDT',
        'https://tether.to/',
    ),
    rif: new Token(
        RSK_TESTNET,
        '0x700E1B86F9c47E10AB94FaA7E6C8260C0F07074D',
        18,
        'RIF',
        'RIF',
        'https://www.makerdao.com/',
    ),
    sov: new Token(
        RSK_TESTNET,
        '0xf5aBC0d6239D494AED4433189e1Ccb96B50E2be8',
        18,
        'SOV',
        'SOV',
        'https://www.makerdao.com/',
    ),
} as const)

export const rskMainnetTokens = defineTokens({
    helix: new Token(
        RSK_MAINNET,
        '0x3d2441fa9aab621e72121fb1c620fdae59eae812',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        RSK_MAINNET,
        '0x967f8799af07df1534d48a95a5c9febe92c53ae0',
        18,
        'WRBTC',
        'Wrapped RSK Bitcoin',
        'https://www.rsk.co/',
    ),
    usdt: new Token(
        RSK_MAINNET,
        '0xef213441a85df4d7acbdae0cf78004e1e486bb96',
        18,
        'rUSDT',
        'Wrapped RSK USDT',
        'https://tether.to/',
    ),
    rif: new Token(
        RSK_MAINNET,
        '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
        18,
        'RIF',
        'RIF',
        'https://www.makerdao.com/',
    ),
    sov: new Token(
        RSK_MAINNET,
        '0xefc78fc7d48b64958315949279ba181c2114abbd',
        18,
        'SOV',
        'SOV',
        'https://www.makerdao.com/',
    ),
} as const)

export const bscMainnetTokens = defineTokens({
    helix: new Token(
        BSC_MAINNET,
        '0xFd9B1448A8874b03e6E8476049dB259A82569a41',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        BSC_MAINNET,
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        18,
        'WBNB',
        'Wrapped BNB',
        'https://www.binance.com/',
    ),
    usdt: new Token(
        BSC_MAINNET,
        '0x55d398326f99059fF775485246999027B3197955',
        18,
        'USDT',
        'Tether USD',
        'https://tether.to/',
    ),
    usdc: new Token(
        BSC_MAINNET,
        '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        18,
        'USDC',
        'Binance-Peg USD Coin',
        'https://www.centre.io/usdc',
    ),
    busd: new Token(
        BSC_MAINNET,
        '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        18,
        'BUSD',
        'Binance USD',
        'https://www.paxos.com/busd/',
    ),
    cake: new Token(
        BSC_MAINNET,
        '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        18,
        'CAKE',
        'PancakeSwap Token',
        'https://pancakeswap.finance/',
    ),
} as const)

export const bscTestnetTokens = defineTokens({
    helix: new Token(
        BSC_TESTNET,
        '0x3d2441fa9aab621e72121fb1c620fdae59eae812',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        BSC_TESTNET,
        '0x967f8799af07df1534d48a95a5c9febe92c53ae0',
        18,
        'WRBTC',
        'Wrapped RSK Bitcoin',
        'https://www.rsk.co/',
    ),
    busd: new Token(
        BSC_TESTNET,
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
        18,
        'BUSD',
        'Binance USD',
        'https://www.paxos.com/busd/',
    ),
} as const)

export const okcMainnetTokens = defineTokens({
    helix: new Token(
        OKC_MAINNET,
        '0xb5687be50e1506820996dB6C1EF3a9CD86a7eB66',
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        OKC_MAINNET,
        '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
        18,
        'WOKT',
        'Wrapped OKT',
        'https://www.okx.com/okc'
    ),
    usdt: new Token(
        OKC_MAINNET,
        '0x382bB369d343125BfB2117af9c149795C6C65C50',
        18,
        'USDT',
        'Tether USD',
        'https://tether.to/',
    ),
    usdc: new Token(
        OKC_MAINNET,
        '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85',
        18,
        'USDC',
        'USD Coin',
        'https://www.centre.io/usdc',
    ),
    che: new Token(
        OKC_MAINNET,
        '0x8179D97Eb6488860d816e3EcAFE694a4153F216c',
        18,
        'CHE',
        'CherrySwap Token',
        'https://www.centre.io/usdc',
    )
} as const)


const tokens = {
    [MAINNET]: mainnetTokens,
    [TESTNET]: testnetTokens,
    [RSK_MAINNET]: rskMainnetTokens,
    [RSK_TESTNET]: rskTestnetTokens,
    [BSC_MAINNET]: bscMainnetTokens,
    [BSC_TESTNET]: bscTestnetTokens,
    [OKC_MAINNET]: okcMainnetTokens,
}

type SerializedTokenList =
    typeof mainnetTokens &
    typeof testnetTokens &
    typeof rskTestnetTokens &
    typeof rskMainnetTokens &
    typeof bscMainnetTokens &
    typeof bscTestnetTokens &
    typeof okcMainnetTokens

const getTokens = (chainId: ChainId): SerializedTokenList => {
    return tokens[chainId] as SerializedTokenList
}

type SerializedTokenListMainNet = Record<keyof typeof mainnetTokens, SerializedToken>
type SerializedTokenListTestNet = Record<keyof typeof testnetTokens, SerializedToken>
type SerializedTokenListRSKTestNet = Record<keyof typeof rskTestnetTokens, SerializedToken>
type SerializedTokenListRSKMainNet = Record<keyof typeof rskTestnetTokens, SerializedToken>
type SerializedTokenListBSCMainNet = Record<keyof typeof bscMainnetTokens, SerializedToken>
type SerializedTokenListBSCTestNet = Record<keyof typeof bscTestnetTokens, SerializedToken>
type SerializedTokenListOKCMainNet = Record<keyof typeof okcMainnetTokens, SerializedToken>
export const serializeTokens = (chainId: ChainId) => {
    switch (chainId) {
        case MAINNET:
            return serializeTokensMainNet()
        case TESTNET:
            return serializeTokensTestNet()
        case RSK_MAINNET:
            return serializeTokensRSKMainNet()
        case RSK_TESTNET:
            return serializeTokensRSKTestNet()
        case BSC_MAINNET:
            return serializeTokensBSCMainNet()
        case BSC_TESTNET:
            return serializeTokensBSCTestNet()
        case OKC_MAINNET:
            return serializeTokensOKCMainNet()
        default:
            return serializeTokensMainNet()
    }
}

export const serializeTokensMainNet = () => {
    const unserializedTokens = getTokens(MAINNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListMainNet)

    return serializedTokens
}

export const serializeTokensTestNet = () => {
    const unserializedTokens = getTokens(TESTNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListTestNet)

    return serializedTokens
}

export const serializeTokensRSKTestNet = () => {
    const unserializedTokens = getTokens(RSK_TESTNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListRSKTestNet)

    return serializedTokens
}

export const serializeTokensRSKMainNet = () => {
    const unserializedTokens = getTokens(RSK_MAINNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListRSKMainNet)

    return serializedTokens
}

export const serializeTokensBSCMainNet = () => {
    const unserializedTokens = getTokens(BSC_MAINNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListBSCMainNet)

    return serializedTokens
}

export const serializeTokensBSCTestNet = () => {
    const unserializedTokens = getTokens(BSC_TESTNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListBSCTestNet)

    return serializedTokens
}

export const serializeTokensOKCMainNet = () => {
    const unserializedTokens = getTokens(OKC_MAINNET)
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenListOKCMainNet)

    return serializedTokens
}

export default getTokens