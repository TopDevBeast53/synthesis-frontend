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
                [ChainId.MAINNET]: '0xa4c1135f0C0123f6683F98A8177F4c51F3179107',    // UpdateMe 
                [ChainId.TESTNET]: '0xc6c81F3092a6e35D2632ffd6FFb7D9baDC9B9AE6',
                [ChainId.RSK_MAINNET]: '0xd5bfd8f6a590a4ae8e9b86266e78e24b8244eef8',
                [ChainId.RSK_TESTNET]: '0xf66c580Bf224044226a3c1f865B500C42703cF0e',
                [ChainId.BSC_MAINNET]: '0x3a391bF56927B69a3A14Aab10731C5d7d7A7b8c3',
                [ChainId.BSC_TESTNET]: '0x570489f4278de24E7421b83C518ABc8B1AfA7D10'
            },
            poolCategory: PoolCategory.CORE,
            harvest: true,
            tokenPerBlock: {
                [ChainId.MAINNET]: '2.278481012658228',
                [ChainId.TESTNET]: '2.278481012658228',
                [ChainId.RSK_MAINNET]: '2.195121951219512',
                [ChainId.RSK_TESTNET]: '2.195121951219512',
                [ChainId.BSC_MAINNET]: '0.1323529411764706',
                [ChainId.BSC_TESTNET]: '0.1323529411764706'
            },
            sortOrder: 1,
            isFinished: false,
        },
    ]
    return pools
}

export default getPools
