/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { getBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getPercentChange, getChangeForPeriod, getAmountChange } from 'views/Info/utils/infoDataHelpers'
import { TokenData } from 'state/info/types'
import { useEthPrices } from 'views/Info/hooks/useEthPrices'
import { ChainId } from 'sdk'
import usePreviousValue from 'hooks/usePreviousValue'
import { useChainIdData } from 'state/info/hooks'

interface TokenFields {
    id: string
    symbol: string
    name: string
    derivedETH: string // Price in ETH per token
    derivedUSD: string // Price in USD per token
    tradeVolumeUSD: string
    totalTransactions: string
    totalLiquidity: string
}

interface FormattedTokenFields
    extends Omit<TokenFields, 'derivedETH' | 'derivedUSD' | 'tradeVolumeUSD' | 'totalTransactions' | 'totalLiquidity'> {
    derivedETH: number
    derivedUSD: number
    tradeVolumeUSD: number
    totalTransactions: number
    totalLiquidity: number
}

interface TokenQueryResponse {
    now: TokenFields[]
    oneDayAgo: TokenFields[]
    twoDaysAgo: TokenFields[]
    oneWeekAgo: TokenFields[]
    twoWeeksAgo: TokenFields[]
}

/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (block: number | undefined, tokens: string[]) => {
    const addressesString = `["${tokens.join('","')}"]`
    const blockString = block ? `block: {number: ${block}}` : ``
    return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedETH
      derivedUSD
      tradeVolumeUSD
      totalTransactions
      totalLiquidity
    }
  `
}

const fetchTokenData = async (
    chainId: ChainId,
    block24h: number,
    block48h: number,
    block7d: number,
    block14d: number,
    tokenAddresses: string[],
) => {
    try {
        const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(null, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(block24h, tokenAddresses)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(block48h, tokenAddresses)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(block7d, tokenAddresses)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(block14d, tokenAddresses)}
      }
    `
        const data = await request<TokenQueryResponse>(INFO_CLIENT[chainId], query)
        return { data, error: false }
    } catch (error) {
        console.error('Failed to fetch token data', error)
        return { error: true }
    }
}

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strings to numbers
const parseTokenData = (tokens?: TokenFields[]) => {
    if (!tokens) {
        return {}
    }
    return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
        const { derivedETH, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity } = tokenData
        accum[tokenData.id] = {
            ...tokenData,
            derivedETH: parseFloat(derivedETH),
            derivedUSD: parseFloat(derivedUSD),
            tradeVolumeUSD: parseFloat(tradeVolumeUSD),
            totalTransactions: parseFloat(totalTransactions),
            totalLiquidity: parseFloat(totalLiquidity),
        }
        return accum
    }, {})
}

interface TokenDatas {
    error: boolean
    data?: {
        [address: string]: TokenData
    }
}

/**
 * Fetch top addresses by volume
 */
const useFetchedTokenDatas = (tokenAddresses: string[]): TokenDatas => {
    const [fetchState, setFetchState] = useState<TokenDatas>({ error: false })
    const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
    const ethPrices = useEthPrices()
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    useEffect(() => {
        if (prevChainId !== chainId) {
            setFetchState({ error: false })
        }
    }, [chainId, prevChainId])

    useEffect(() => {
        const fetch = async () => {
            const chainIds = chainId ? [chainId] : [ChainId.MAINNET, ChainId.BSC_MAINNET]
            const tokenDatas = (await Promise.all(chainIds.map(async (_chainId) => {
                const blocks = await getBlocksFromTimestamps(_chainId, [t24h, t48h, t7d, t14d])
                const [block24h, block48h, block7d, block14d] = blocks ?? []
                const { error, data } = await fetchTokenData(
                    _chainId,
                    block24h.number,
                    block48h.number,
                    block7d.number,
                    block14d.number,
                    tokenAddresses.filter((address) => address.includes(`-${_chainId}`))
                        .map((address) => address.replace(`-${_chainId}`, '')),
                )
                if (error) {
                    return null
                }
                const parsed = parseTokenData(data?.now)
                const parsed24 = parseTokenData(data?.oneDayAgo)
                const parsed48 = parseTokenData(data?.twoDaysAgo)
                const parsed7d = parseTokenData(data?.oneWeekAgo)
                const parsed14d = parseTokenData(data?.twoWeeksAgo)

                // Calculate data and format
                const formatted = tokenAddresses.filter((address) => address.includes(`-${_chainId}`))
                    .map((address) => address.replace(`-${_chainId}`, ''))
                    .reduce((accum: { [address: string]: TokenData }, address) => {
                        const current: FormattedTokenFields | undefined = parsed[address]
                        const oneDay: FormattedTokenFields | undefined = parsed24[address]
                        const twoDays: FormattedTokenFields | undefined = parsed48[address]
                        const week: FormattedTokenFields | undefined = parsed7d[address]
                        const twoWeeks: FormattedTokenFields | undefined = parsed14d[address]

                        const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
                            current?.tradeVolumeUSD,
                            oneDay?.tradeVolumeUSD,
                            twoDays?.tradeVolumeUSD,
                        )
                        const [volumeUSDWeek] = getChangeForPeriod(
                            current?.tradeVolumeUSD,
                            week?.tradeVolumeUSD,
                            twoWeeks?.tradeVolumeUSD,
                        )
                        const liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0
                        const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0
                        const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
                        const liquidityToken = current ? current.totalLiquidity : 0
                        // Prices of tokens for now, 24h ago and 7d ago
                        const priceUSD = current ? current.derivedETH * ethPrices[_chainId].current : 0
                        const priceUSDOneDay = oneDay ? oneDay.derivedETH * ethPrices[_chainId].oneDay : 0
                        const priceUSDWeek = week ? week.derivedETH * ethPrices[_chainId].week : 0
                        const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
                        const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
                        const txCount = getAmountChange(current?.totalTransactions, oneDay?.totalTransactions)

                        accum[`${address}-${_chainId}`] = {
                            exists: !!current,
                            address,
                            name: current ? current.name : '',
                            symbol: current ? current.symbol : '',
                            volumeUSD,
                            volumeUSDChange,
                            volumeUSDWeek,
                            txCount,
                            liquidityUSD,
                            liquidityUSDChange,
                            liquidityToken,
                            priceUSD,
                            priceUSDChange,
                            priceUSDChangeWeek,
                            chainId: _chainId,
                        }

                        return accum
                    }, {})
                return formatted
        }))).reduce((prev, cur) => ({ ...prev, ...cur }), {})

    if (Object.keys(tokenDatas).length === 0) {
        setFetchState({ error: false })
        return
    }
    setFetchState({ data: tokenDatas, error: false })
}
const allBlocksAvailable = t24h && t48h && t7d && t14d
if (tokenAddresses.length > 0 && allBlocksAvailable && ethPrices && !fetchState.data) {
    fetch()
}
    }, [tokenAddresses, t24h, t48h, t7d, t14d, ethPrices, chainId, fetchState])

return fetchState
}

export default useFetchedTokenDatas
