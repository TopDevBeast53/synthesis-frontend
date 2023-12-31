import { VaultKey } from 'state/types'
import { DEFAULT_GAS_LIMIT } from 'config'
import { ChainId } from 'sdk'
import getTokens, { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

export const getVaultPoolConfig = (chainId: ChainId) => {
    const tokens = getTokens(chainId)
    return {
        [VaultKey.HelixAutoPool]: {
            name: 'Auto HELIX',
            description: 'Automatic restaking',
            autoCompoundFrequency: 1,
            gasLimit: DEFAULT_GAS_LIMIT,
            tokenImage: {
                primarySrc: `/images/tokens/${tokens.helix.address}.svg`,
                secondarySrc: '/images/tokens/autorenew.svg',
            },
        },
        [VaultKey.IfoPool]: {
            name: 'IFO HELIX',
            description: 'Stake HELIX to participate in IFOs',
            autoCompoundFrequency: 1,
            gasLimit: DEFAULT_GAS_LIMIT,
            tokenImage: {
                primarySrc: `/images/tokens/${tokens.helix.address}.svg`,
                secondarySrc: `/images/tokens/${tokens.helix.address}.svg`,
            },
        },
    }
}

const getPools = (chainId: ChainId) => {
    const serializedTokens = serializeTokens(chainId)

    const pools: SerializedPoolConfig[] = [
        {
            sousId: 0,
            stakingToken: serializedTokens.helix,
            earningToken: serializedTokens.helix,
            contractAddress: {
                [ChainId.MAINNET]: '0xa4c1135f0C0123f6683F98A8177F4c51F3179107',
                [ChainId.TESTNET]: '0x2ACEDD6dC15F74b54DD4fAb741D1F32FbAe65f60',
                [ChainId.RSK_MAINNET]: '0xd5bfd8f6a590a4ae8e9b86266e78e24b8244eef8',
                [ChainId.RSK_TESTNET]: '0xf66c580Bf224044226a3c1f865B500C42703cF0e',
                [ChainId.BSC_MAINNET]: '0x3a391bF56927B69a3A14Aab10731C5d7d7A7b8c3',
                [ChainId.BSC_TESTNET]: '0x570489f4278de24E7421b83C518ABc8B1AfA7D10',
                [ChainId.OKC_MAINNET]: '0xC99F7Ad8C8DCCBd500D2d791F61b7B75d7F38432',
            },
            poolCategory: PoolCategory.CORE,
            harvest: true,
            tokenPerBlock: {
                [ChainId.MAINNET]: '2.278481012658228',
                [ChainId.TESTNET]: '2.278481012658228',
                [ChainId.RSK_MAINNET]: '2.390634146',
                [ChainId.RSK_TESTNET]: '2.390634146',
                [ChainId.BSC_MAINNET]: '0.144141176',
                [ChainId.BSC_TESTNET]: '0.144141176',
                [ChainId.OKC_MAINNET]: '0.143438049',
            },
            sortOrder: 1,
            isFinished: false,
        },
    ]
    return pools
}

export default getPools
