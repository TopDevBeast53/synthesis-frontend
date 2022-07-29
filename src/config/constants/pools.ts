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
                1: '0xa4c1135f0C0123f6683F98A8177F4c51F3179107',    // UpdateMe 
                4: '0xc6c81F3092a6e35D2632ffd6FFb7D9baDC9B9AE6',
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
