import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { GRAPH_HEALTH } from 'config/constants/endpoints'
import useProviders from 'hooks/useProviders'
import { ChainId } from 'sdk'
import { useSlowFresh } from './useRefresh'
import useGetChainDetail from './useGetChainDetail'

export enum SubgraphStatus {
    OK,
    WARNING,
    NOT_OK,
    UNKNOWN,
}

export type SubgraphHealthState = {
    status: SubgraphStatus
    currentBlock: number
    chainHeadBlock: number
    latestBlock: number
    blockDifference: number
}

const NOT_OK_BLOCK_DIFFERENCE = 200 // ~15 minutes delay
const WARNING_BLOCK_DIFFERENCE = 50 // ~2.5 minute delay

const SUBGRAPH_PATH = {
    [ChainId.MAINNET]: "qiangkaiwen/helix",
    [ChainId.TESTNET]: "qiangkaiwen/helix-rinkeby"
}

const useSubgraphHealth = () => {
    const [sgHealth, setSgHealth] = useState<SubgraphHealthState>({
        status: SubgraphStatus.UNKNOWN,
        currentBlock: 0,
        chainHeadBlock: 0,
        latestBlock: 0,
        blockDifference: 0,
    })

    const slowRefresh = useSlowFresh()
    const rpcProvider = useProviders()
    const network = useGetChainDetail()

    useEffect(() => {
        const getSubgraphHealth = async () => {
            try {
                const { indexingStatusForCurrentVersion } = await request(
                    GRAPH_HEALTH,
                    gql`
                        query getNftMarketSubgraphHealth ($subgraph: String!) {
                            indexingStatusForCurrentVersion(subgraphName: $subgraph) {
                                synced
                                health
                                chains {
                                    chainHeadBlock {
                                        number
                                    }
                                    latestBlock {
                                        number
                                    }
                                }
                            }
                        }
                    `,
                    { subgraph: SUBGRAPH_PATH[network.CHAIN_ID] }
                )

                const currentBlock = await rpcProvider.getBlockNumber()

                const isHealthy = indexingStatusForCurrentVersion.health === 'healthy'
                const chainHeadBlock = parseInt(indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number)
                const latestBlock = parseInt(indexingStatusForCurrentVersion.chains[0].latestBlock.number)
                const blockDifference = currentBlock - latestBlock
                // Sometimes subgraph might report old block as chainHeadBlock, so its important to compare
                // it with block retrieved from rpcProvider.getBlockNumber()
                const chainHeadBlockDifference = currentBlock - chainHeadBlock
                if (
                    !isHealthy ||
                    blockDifference > NOT_OK_BLOCK_DIFFERENCE ||
                    chainHeadBlockDifference > NOT_OK_BLOCK_DIFFERENCE
                ) {
                    setSgHealth({
                        status: SubgraphStatus.NOT_OK,
                        currentBlock,
                        chainHeadBlock,
                        latestBlock,
                        blockDifference,
                    })
                } else if (
                    blockDifference > WARNING_BLOCK_DIFFERENCE ||
                    chainHeadBlockDifference > WARNING_BLOCK_DIFFERENCE
                ) {
                    setSgHealth({
                        status: SubgraphStatus.WARNING,
                        currentBlock,
                        chainHeadBlock,
                        latestBlock,
                        blockDifference,
                    })
                } else {
                    setSgHealth({
                        status: SubgraphStatus.OK,
                        currentBlock,
                        chainHeadBlock,
                        latestBlock,
                        blockDifference,
                    })
                }
            } catch (error) {
                console.error('Failed to perform health check for Data Analytics subgraph', error)
            }
        }
        getSubgraphHealth()
    }, [slowRefresh, rpcProvider, network.CHAIN_ID])

    return sgHealth
}

export default useSubgraphHealth
