import React, { useEffect, useMemo } from 'react'
import useFetchProtocolData from 'state/info/queries/protocol/overview'
import useFetchGlobalChartData from 'state/info/queries/protocol/chart'
import fetchTopTransactions from 'state/info/queries/protocol/transactions'
import useTopPoolAddresses from 'state/info/queries/pools/topPools'
import usePoolDatas from 'state/info/queries/pools/poolData'
import useFetchedTokenDatas from 'state/info/queries/tokens/tokenData'
import useTopTokenAddresses from 'state/info/queries/tokens/topTokens'
import usePreviousValue from 'hooks/usePreviousValue'
import {
    useProtocolData,
    useProtocolChartData,
    useProtocolTransactions,
    useUpdatePoolData,
    useAllPoolData,
    useAddPoolKeys,
    useAllTokenData,
    useUpdateTokenData,
    useAddTokenKeys,
    useChainIdData,
} from './hooks'

export const ProtocolUpdater: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [protocolData, setProtocolData] = useProtocolData()
    const { data: fetchedProtocolData, error } = useFetchProtocolData()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [chartData, updateChartData] = useProtocolChartData()
    const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData()

    const [transactions, updateTransactions] = useProtocolTransactions()
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    // update overview data if available and not set
    useEffect(() => {
        if ((fetchedProtocolData && !error)) {
            setProtocolData(fetchedProtocolData)
        }
    }, [error, fetchedProtocolData, setProtocolData])

    // update global chart data if available and not set
    useEffect(() => {
        if ((fetchedChartData && !chartError)) {
            updateChartData(fetchedChartData)
        }
    }, [chartError, fetchedChartData, updateChartData])

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchTopTransactions(chainId)
            if (data) {
                updateTransactions(data)
            }
        }
        if (!transactions || prevChainId !== chainId) {
            fetch()
        }
    }, [chainId, transactions, updateTransactions, prevChainId])

    return null
}

export const PoolUpdater: React.FC = () => {
    const updatePoolData = useUpdatePoolData()
    const addPoolKeys = useAddPoolKeys()
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    const allPoolData = useAllPoolData()
    const addresses = useTopPoolAddresses()

    // add top pools on first load
    useEffect(() => {
        if (addresses.length > 0 || chainId !== prevChainId) {
            addPoolKeys(addresses)
        }
    }, [addPoolKeys, addresses, chainId, prevChainId])

    // detect for which addresses we havent loaded pool data yet
    const unfetchedPoolAddresses = useMemo(() => {
        return Object.keys(allPoolData).reduce((accum: string[], address) => {
            const poolData = allPoolData[address]
            if (!poolData.data) {
                accum.push(address)
            }
            return accum
        }, [])
    }, [allPoolData])

    // fetch data for unfetched pools and update them
    const { error: poolDataError, data: poolDatas } = usePoolDatas(unfetchedPoolAddresses)
    useEffect(() => {
        if (poolDatas && !poolDataError) {
            updatePoolData(Object.values(poolDatas))
        } else {
            updatePoolData([])
        }
    }, [poolDataError, poolDatas, updatePoolData])

    return null
}

export const TokenUpdater = (): null => {
    const updateTokenDatas = useUpdateTokenData()
    const addTokenKeys = useAddTokenKeys()
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    const allTokenData = useAllTokenData()
    const addresses = useTopTokenAddresses()

    // add top tokens on first load
    useEffect(() => {
        if (addresses.length > 0 || chainId !== prevChainId) {
            addTokenKeys(addresses)
        }
    }, [addTokenKeys, addresses, chainId, prevChainId])

    // detect for which addresses we havent loaded token data yet
    const unfetchedTokenAddresses = useMemo(() => {
        return Object.keys(allTokenData).reduce((accum: string[], key) => {
            const tokenData = allTokenData[key]
            if (!tokenData.data) {
                accum.push(key)
            }
            return accum
        }, [])
    }, [allTokenData])

    // fetch data for unfetched tokens and update them
    const { error: tokenDataError, data: tokenDatas } = useFetchedTokenDatas(unfetchedTokenAddresses)
    useEffect(() => {
        if (tokenDatas && !tokenDataError) {
            updateTokenDatas(Object.values(tokenDatas))
        } else {
            updateTokenDatas([])
        }
    }, [tokenDataError, tokenDatas, updateTokenDatas])

    return null
}
