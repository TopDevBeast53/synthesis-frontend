import { fromUnixTime } from 'date-fns'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { DerivedPairDataNormalized, PairDataNormalized, PairDataTimeWindowEnum, PairPricesNormalized } from './types'

export const normalizeChartData = (
    data: PairHoursDatasResponse | PairDayDatasResponse | null,
    timeWindow: PairDataTimeWindowEnum,
) => {
    switch (timeWindow) {
        case PairDataTimeWindowEnum.DAY:
        case PairDataTimeWindowEnum.WEEK:
            return (data as PairHoursDatasResponse)?.pairHourDatas?.map((fetchPairEntry) => ({
                time: fetchPairEntry.hourStartUnix,
                token0Id: fetchPairEntry.pair.token0.id,
                token1Id: fetchPairEntry.pair.token1.id,
                reserve0: parseFloat(fetchPairEntry.reserve0),
                reserve1: parseFloat(fetchPairEntry.reserve1),
            }))
        case PairDataTimeWindowEnum.MONTH:
        case PairDataTimeWindowEnum.YEAR:
            return (data as PairDayDatasResponse)?.pairDayDatas?.map((fetchPairEntry) => ({
                time: fetchPairEntry.date,
                token0Id: fetchPairEntry.pairAddress.token0.id,
                token1Id: fetchPairEntry.pairAddress.token1.id,
                reserve0: parseFloat(fetchPairEntry.reserve0),
                reserve1: parseFloat(fetchPairEntry.reserve1),
            }))
        default:
            return null
    }
}

export const normalizeDerivedChartData = (data: any) => {
    if (!data?.token0DerivedEth || data?.token0DerivedEth.length === 0) {
        return []
    }
    return data?.token0DerivedEth.reduce((acc, token0DerivedEthEntry) => {
        const token1DerivedEthEntry = data?.token1DerivedEth?.find(
            (entry) => entry.timestamp === token0DerivedEthEntry.timestamp,
        )
        if (!token1DerivedEthEntry) {
            return acc
        }
        return [
            ...acc,
            {
                time: parseInt(token0DerivedEthEntry.timestamp, 10),
                token0Id: token0DerivedEthEntry.tokenAddress,
                token1Id: token1DerivedEthEntry.tokenAddress,
                token0DerivedETH: token0DerivedEthEntry.derivedETH,
                token1DerivedETH: token1DerivedEthEntry.derivedETH,
            },
        ]
    }, [])
}

type normalizePairDataByActiveTokenParams = {
    pairData: PairDataNormalized
    activeToken: string
}

export const normalizePairDataByActiveToken = ({
    pairData,
    activeToken,
}: normalizePairDataByActiveTokenParams): PairPricesNormalized =>
    pairData
        ?.map((pairPrice) => ({
            time: fromUnixTime(pairPrice.time),
            value:
                activeToken === pairPrice?.token0Id
                    ? pairPrice.reserve1 / pairPrice.reserve0
                    : pairPrice.reserve0 / pairPrice.reserve1,
        }))
        .reverse()

type normalizeDerivedPairDataByActiveTokenParams = {
    pairData: DerivedPairDataNormalized
    activeToken: string
}

export const normalizeDerivedPairDataByActiveToken = ({
    pairData,
    activeToken,
}: normalizeDerivedPairDataByActiveTokenParams): PairPricesNormalized =>
    pairData?.map((pairPrice) => ({
        time: fromUnixTime(pairPrice.time),
        value:
            activeToken === pairPrice?.token0Id
                ? pairPrice.token0DerivedETH / pairPrice.token1DerivedETH
                : pairPrice.token1DerivedETH / pairPrice.token0DerivedETH,
    }))
