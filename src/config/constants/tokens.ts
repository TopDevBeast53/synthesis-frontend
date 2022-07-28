import { ChainId, Token } from 'sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
    [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = defineTokens({
    // Update Me: update svg file name equal to the token address
    helix: new Token(
        MAINNET,
        '0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980', // update me 0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        MAINNET,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // update me
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
        'USDC',
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
        'USDC',
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

const tokens = () => {
    const chainId = process.env.REACT_APP_CHAIN_ID

    // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
    if (parseInt(chainId, 10) === ChainId.TESTNET) {
        return Object.keys(mainnetTokens).reduce((accum, key) => {
            return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
        }, {} as typeof testnetTokens & typeof mainnetTokens)
    }

    return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
    const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
        return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    }, {} as SerializedTokenList)

    return serializedTokens
}

export default unserializedTokens
