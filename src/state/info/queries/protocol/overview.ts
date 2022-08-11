import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { getChangeForPeriod, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { ProtocolData } from 'state/info/types'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { getBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { ChainId } from 'sdk'
import usePreviousValue from 'hooks/usePreviousValue'
import { useChainIdData } from 'state/info/hooks'

interface HelixFactory {
    totalTransactions: string
    totalVolumeUSD: string
    totalLiquidityUSD: string
}

interface OverviewResponse {
    helixFactories: HelixFactory[]
}

/**
 * Latest Liquidity, Volume and Transaction count
 */
const getOverviewData = async (chainId: ChainId, block?: number): Promise<{ data?: OverviewResponse; error: boolean }> => {
    try {
        const query = gql`query overview {
      helixFactories(
        ${block ? `block: { number: ${block}}` : ``} 
        first: 1) {
        totalTransactions
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
        const data = await request<OverviewResponse>(INFO_CLIENT[chainId], query)
        return { data, error: false }
    } catch (error) {
        console.error('Failed to fetch info overview', error)
        return { data: null, error: true }
    }
}

const formatHelixFactoryResponse = (rawHelixFactory?: HelixFactory) => {
    if (rawHelixFactory) {
        return {
            totalTransactions: parseFloat(rawHelixFactory.totalTransactions),
            totalVolumeUSD: parseFloat(rawHelixFactory.totalVolumeUSD),
            totalLiquidityUSD: parseFloat(rawHelixFactory.totalLiquidityUSD),
        }
    }
    return null
}

interface ProtocolFetchState {
    error: boolean
    data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)
    const [fetchState, setFetchState] = useState<ProtocolFetchState>({
        error: false,
    })
    const [t24, t48] = getDeltaTimestamps()

    useEffect(() => {
        if (prevChainId !== chainId) {
            setFetchState({
                error: false,
            })
        }
    }, [chainId, prevChainId])

    useEffect(() => {
        const fetch = async () => {
            const blocks = await getBlocksFromTimestamps(chainId, [t24, t48])
            const [block24, block48] = blocks ?? []
            const { error, data } = await getOverviewData(chainId)
            const { error: error24, data: data24 } = await getOverviewData(chainId, block24?.number ?? undefined)
            const { error: error48, data: data48 } = await getOverviewData(chainId, block48?.number ?? undefined)
            const anyError = error || error24 || error48
            const overviewData = formatHelixFactoryResponse(data?.helixFactories?.[0])
            const overviewData24 = formatHelixFactoryResponse(data24?.helixFactories?.[0])
            const overviewData48 = formatHelixFactoryResponse(data48?.helixFactories?.[0])
            const allDataAvailable = overviewData && overviewData24 && overviewData48
            if (anyError || !allDataAvailable) {
                setFetchState({
                    error: true,
                })
            } else {
                const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
                    overviewData.totalVolumeUSD,
                    overviewData24.totalVolumeUSD,
                    overviewData48.totalVolumeUSD,
                )
                const liquidityUSDChange = getPercentChange(
                    overviewData.totalLiquidityUSD,
                    overviewData24.totalLiquidityUSD,
                )
                // 24H transactions
                const [txCount, txCountChange] = getChangeForPeriod(
                    overviewData.totalTransactions,
                    overviewData24.totalTransactions,
                    overviewData48.totalTransactions,
                )
                const protocolData: ProtocolData = {
                    volumeUSD,
                    volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
                    liquidityUSD: overviewData.totalLiquidityUSD,
                    liquidityUSDChange,
                    txCount,
                    txCountChange,
                }
                setFetchState({
                    error: false,
                    data: protocolData,
                })
            }
        }
        const allBlocksAvailable = t24 && t48
        if (allBlocksAvailable && !fetchState.data) {
            fetch()
        }
    }, [t24, t48, chainId, fetchState])

    return fetchState
}

export default useFetchProtocolData
