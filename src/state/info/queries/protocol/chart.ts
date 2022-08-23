/* eslint-disable no-await-in-loop */
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { HELIX_START } from 'config/constants/info'
import { ChartEntry } from 'state/info/types'
import { ChainId } from 'sdk'
import usePreviousValue from 'hooks/usePreviousValue'
import { useChainIdData } from 'state/info/hooks'
import { helixDayDatasResponse } from '../types'
import { fetchChartData, mapDayData } from '../helpers'

/**
 * Data for displaying Liquidity and Volume charts on Overview page
 */
const HELIX_DAY_DATAS = gql`
    query overviewCharts($startTime: Int!, $skip: Int!) {
        helixDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            date
            dailyVolumeUSD
            totalLiquidityUSD
        }
    }
`

const getOverviewChartData = async (chainId: ChainId, skip: number): Promise<{ data?: ChartEntry[]; error: boolean }> => {
    try {
        const { helixDayDatas } = await request<helixDayDatasResponse>(INFO_CLIENT[chainId], HELIX_DAY_DATAS, {
            startTime: HELIX_START[chainId],
            skip,
        })
        const data = helixDayDatas.map(mapDayData)
        return { data, error: false }
    } catch (error) {
        console.error('Failed to fetch overview chart data', error)
        return { error: true }
    }
}

/**
 * Fetch historic chart data
 */
const useFetchGlobalChartData = (): {
    error: boolean
    data: ChartEntry[] | undefined
} => {
    const [overviewChartData, setOverviewChartData] = useState<ChartEntry[] | undefined>()
    const [error, setError] = useState(false)
    const { chainId } = useChainIdData()
    const prevChainId = usePreviousValue(chainId)

    useEffect(() => {
        if (prevChainId !== chainId) {
            setOverviewChartData(undefined)
            setError(false)
        }
    }, [chainId, prevChainId])

    useEffect(() => {
        const fetch = async () => {
            const chainIds = chainId ? [chainId] : [ChainId.MAINNET, ChainId.BSC_MAINNET]
            const chartDatas = await Promise.all(chainIds.map(async (_chainId): Promise<ChartEntry[]> => {
                const { data } = await fetchChartData(_chainId, getOverviewChartData)
                return data
            }))

            const _error = chartDatas.every(_chartData => _chartData === null)
            if (_error) {
                setError(true)
                return
            }

            const chartData: ChartEntry[] = chartDatas[0] || []
            chartDatas.slice(1).forEach(_chartData => {
                if (_chartData === null) return
                _chartData.forEach(data => {
                    const existing = chartData.find(data_ => data_.date === data.date)
                    if (existing) {
                        existing.liquidityUSD += data.liquidityUSD
                        existing.volumeUSD += data.volumeUSD
                    } else {
                        chartData.push(data)
                    }
                })
            })
            chartData.sort((a, b) => a.date - b.date)
            setOverviewChartData(chartData)
        }
        if ((!overviewChartData && !error) || prevChainId !== chainId) {
            fetch()
        }
    }, [overviewChartData, error, chainId, prevChainId])

    return {
        error,
        data: overviewChartData,
    }
}

export default useFetchGlobalChartData
