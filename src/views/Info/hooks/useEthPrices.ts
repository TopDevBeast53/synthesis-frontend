import { getBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { ChainId } from 'sdk'
import usePreviousValue from 'hooks/usePreviousValue'
import { useChainIdData } from 'state/info/hooks'

export interface EthPrices {
    current: number
    oneDay: number
    twoDay: number
    week: number
}

export type EthPricesChain = {
    [chainId: number]: EthPrices
}

const ETH_PRICES = gql`
    query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
        current: bundle(id: "1") {
            ethPrice
        }
        oneDay: bundle(id: "1", block: { number: $block24 }) {
            ethPrice
        }
        twoDay: bundle(id: "1", block: { number: $block48 }) {
            ethPrice
        }
        oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
            ethPrice
        }
    }
`

interface PricesResponse {
    current: {
        ethPrice: string
    }
    oneDay: {
        ethPrice: string
    }
    twoDay: {
        ethPrice: string
    }
    oneWeek: {
        ethPrice: string
    }
}

const fetchEthPrices = async (
    chainId: ChainId,
    block24: number,
    block48: number,
    blockWeek: number,
): Promise<{ ethPrices: EthPrices | undefined; error: boolean }> => {
    try {
        const data = await request<PricesResponse>(INFO_CLIENT[chainId], ETH_PRICES, {
            block24,
            block48,
            blockWeek,
        })
        return {
            error: false,
            ethPrices: {
                current: parseFloat(data.current?.ethPrice ?? '0'),
                oneDay: parseFloat(data.oneDay?.ethPrice ?? '0'),
                twoDay: parseFloat(data.twoDay?.ethPrice ?? '0'),
                week: parseFloat(data.oneWeek?.ethPrice ?? '0'),
            },
        }
    } catch (error) {
        console.error('Failed to fetch ETH prices', error)
        return {
            error: true,
            ethPrices: undefined,
        }
    }
}

/**
 * Returns ETH prices at current, 24h, 48h, and 7d intervals
 */
export const useEthPrices = (): EthPricesChain | undefined => {
    const [prices, setPrices] = useState<EthPricesChain | undefined>()
    const [error, setError] = useState(false)
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    const [t24, t48, tWeek] = getDeltaTimestamps()

    useEffect(() => {
        if (chainId !== prevChainId) {
            setPrices(undefined)
            setError(false)
        }
    }, [chainId, prevChainId])

    useEffect(() => {
        const fetch = async () => {
            const chainIds = chainId ? [chainId] : [ChainId.MAINNET, ChainId.BSC_MAINNET]
            const ethPricesData = (await Promise.all(chainIds.map(async (_chainId) => {
                const blocks = await getBlocksFromTimestamps(_chainId, [t24, t48, tWeek])
                const [block24, block48, blockWeek] = blocks ?? []
                const { ethPrices, error: fetchError } = await fetchEthPrices(
                    _chainId,
                    block24.number,
                    block48.number,
                    blockWeek.number,
                )
                if (fetchError) {
                    return null
                }
                return { [_chainId]: ethPrices }
            }))).reduce((prev, cur) => ({ ...prev, ...cur }), {})
            if (Object.keys(ethPricesData).length === 0) {
                setError(true)
                return
            }
            setPrices(ethPricesData)
        }
        const allBlocksAvailable = t24 && t48 && tWeek

        if (!prices && !error && allBlocksAvailable) {
            fetch()
        }
    }, [error, prices, chainId, t24, t48, tWeek])

    return prices
}
