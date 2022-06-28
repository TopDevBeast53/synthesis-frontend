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
        '0xB3F97C4DbBEf56f3220e9ceFf80b93eB483D0Ef7', // update me 0x231CC03E6d8b7368eC2aBfAfb5f73D216c8af980
        18,
        'HELIX',
        'Helix',
        'https://helix.finance/',
    ),
    weth: new Token(
        MAINNET,
        '0xc778417E063141139Fce010982780140Aa0cD5Ab', // update me
        18,
        'WETH',
        'Wrapped ETH',
        'https://www.ethereum.org/',
    ),
    dai: new Token(
        MAINNET,
        '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
        18,
        'DAI',
        'Dai Stablecoin',
        'https://www.makerdao.com/',
    ),
    usdt: new Token(
        MAINNET,
        '0x110a13FC3efE6A245B50102D2d79B3E76125Ae83',
        6,
        'USDT',
        'Tether USD',
        'https://tether.to/',
    ),
    usdc: new Token(
        MAINNET,
        '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        6,
        'USDC',
        'USDC',
        'https://www.paxos.com/busd/',
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
        'https://www.paxos.com/busd/',
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
