// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Text, Skeleton } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { TableWrapper, Break } from 'views/Info/components/InfoTables/shared'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFetchMasterChefAllocationData } from 'state/farms/useFetchMasterChefData'
import { getFarms } from 'config/constants'
import { ethersToBigNumber } from 'utils/bigNumber'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 30px 0.5fr 1fr 0.5fr 0.2fr;
  padding: 0 24px;
`

const TableLoader: React.FC = () => {
  const loadingRow = (
    <>
      <ResponsiveGrid>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </ResponsiveGrid>
      <Break />
    </>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const AllocPoints: React.FC = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const fetchMasterChefAllocationData = useFetchMasterChefAllocationData()
  const [loading, setLoading] = useState(false)
  const [totalAllocPoint, setTotalAllocPoint] = useState(0)
  const [poolsInfo, setPoolsInfo] = useState([])

  const farms = useMemo(() => getFarms(chainId), [chainId])

  useEffect(() => {
    const getInfos = async () => {
      setLoading(true)

      try {
        const [_totalAllocPoint, ..._poolsInfo] = await fetchMasterChefAllocationData(farms)
        setTotalAllocPoint(ethersToBigNumber(_totalAllocPoint).toNumber())
        setPoolsInfo(
          _poolsInfo
            .map((poolInfo, index) => ({
              pid: farms[index].pid,
              symbol: farms[index].lpSymbol,
              allocPoint: ethersToBigNumber(poolInfo.allocPoint).toNumber(),
              address: farms[index].lpAddress,
            }))
            .sort((a, b) => a.pid - b.pid),
        )
      } catch (error) {
        console.error(error)
        return
      }

      setLoading(false)
    }
    getInfos()
  }, [farms, fetchMasterChefAllocationData])

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Pid')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Config')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Address')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Value')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase" />
      </ResponsiveGrid>
      <Break />

      <ResponsiveGrid>
        <Text>#</Text>
        <Text>{t('Total Allocation Points')}</Text>
        {loading ? <Skeleton /> : <Text />}
        {loading ? <Skeleton /> : <Text>{totalAllocPoint}</Text>}
        {loading ? <Skeleton /> : <Text />}
      </ResponsiveGrid>
      <Break />

      {loading ? (
        <TableLoader />
      ) : (
        poolsInfo.map((poolInfo) => (
          <React.Fragment key={poolInfo.symbol}>
            <ResponsiveGrid>
              <Text>{poolInfo.pid}</Text>
              <Text>{t(poolInfo.symbol)}</Text>
              <Text style={{ whiteSpace: 'break-spaces', wordBreak: 'break-word' }}>{poolInfo.address}</Text>
              <Text>{poolInfo.allocPoint}</Text>
              <Text />
            </ResponsiveGrid>
            <Break />
          </React.Fragment>
        ))
      )}
    </TableWrapper>
  )
}

export default AllocPoints
