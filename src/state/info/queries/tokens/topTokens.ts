import { useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { TOKEN_BLACKLIST } from 'config/constants/info'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { ChainId } from 'sdk'
import usePreviousValue from 'hooks/usePreviousValue'
import { useChainIdData } from 'state/info/hooks'
import { flatten } from 'lodash'

interface TopTokensResponse {
    tokenDayDatas: {
        id: string
    }[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */
const fetchTopTokens = async (chainId: ChainId, timestamp24hAgo: number): Promise<string[]> => {
    try {
        const query = gql`
            query topTokens($blacklist: [String!], $timestamp24hAgo: Int) {
                tokenDayDatas(
                    first: 30
                    where: { dailyTxns_gt: 0, id_not_in: $blacklist, date_gt: $timestamp24hAgo }
                    orderBy: dailyVolumeUSD
                    orderDirection: desc
                ) {
                    id
                }
            }
        `
        const data = await request<TopTokensResponse>(INFO_CLIENT[chainId], query, {
            blacklist: TOKEN_BLACKLIST,
            timestamp24hAgo,
        })
        // tokenDayDatas id has compound id "0xTOKENADDRESS-NUMBERS", extracting token address with .split('-')
        return data.tokenDayDatas.map((t) => t.id.split('-')[0])
    } catch (error) {
        console.error('Failed to fetch top tokens', error)
        return []
    }
}

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
    const [topTokenAddresses, setTopTokenAddresses] = useState([])
    const [timestamp24hAgo] = getDeltaTimestamps()
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    useEffect(() => {
        const fetch = async () => {
            const chainIds = chainId ? [chainId] : [ChainId.MAINNET, ChainId.BSC_MAINNET]
            const addresses = await Promise.all(chainIds.map(async (_chainId) => {
                const rowAddresses = (await fetchTopTokens(_chainId, timestamp24hAgo))
                    .map((address) => {
                        return `${address}-${_chainId}`
                    })
                return rowAddresses
            }))
            setTopTokenAddresses(flatten(addresses))
        }
        if (topTokenAddresses.length === 0 || prevChainId !== chainId) {
            fetch()
        }
    }, [topTokenAddresses, timestamp24hAgo, chainId, prevChainId])

    return topTokenAddresses
}

export default useTopTokenAddresses
