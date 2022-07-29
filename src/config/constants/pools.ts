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
                [ChainId.RSK_MAINNET]: '0x94b6327dA4f39f54EFf829BfA220d485948Fcc6E',
                [ChainId.RSK_TESTNET]: '0xE5B2B45e06F6004147e5b1FBbDd183DB0e6EEc6F'
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
