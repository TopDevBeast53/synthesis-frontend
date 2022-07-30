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
                [ChainId.RSK_MAINNET]: '0x94b6327da4f39f54eff829bfa220d485948fcc6e',
                [ChainId.RSK_TESTNET]: '0xf66c580Bf224044226a3c1f865B500C42703cF0e'
            },
            poolCategory: PoolCategory.CORE,
            harvest: true,
            tokenPerBlock: '2.278481012658228',
            sortOrder: 1,
            isFinished: false,
        },
    ]
    return pools
}

export default getPools
