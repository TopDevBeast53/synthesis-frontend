import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { ChainId } from 'sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export interface EthPrices {
    current: number
    oneDay: number
    twoDay: number
    week: number
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
export const useEthPrices = (): EthPrices | undefined => {
    const [prices, setPrices] = useState<EthPrices | undefined>()
    const [error, setError] = useState(false)
    const { chainId } = useActiveWeb3React()

    const [t24, t48, tWeek] = getDeltaTimestamps()
    const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

    useEffect(() => {
        const fetch = async () => {
            const [block24, block48, blockWeek] = blocks
            const { ethPrices, error: fetchError } = await fetchEthPrices(
                chainId,
                block24.number,
                block48.number,
                blockWeek.number,
            )
            if (fetchError) {
                setError(true)
            } else {
                setPrices(ethPrices)
            }
        }
        if (!prices && !error && blocks && !blockError) {
            fetch()
        }
    }, [error, prices, blocks, blockError, chainId])

    return prices
}
