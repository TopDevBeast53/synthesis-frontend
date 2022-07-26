import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from 'uikit'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { useTranslation } from 'contexts/Localization'
import { DurationStructOutput } from 'config/abi/types/HelixVault'
import { ClickableColumnHeader, TableWrapper, Break } from 'views/Info/components/InfoTables/shared'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 4fr 2fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 20px 4fr 3fr 20px 4fr 3fr;
  }
`

const TableLoader: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      {!isMobile && <Skeleton />}
      {!isMobile && <Skeleton />}
      {!isMobile && <Skeleton />}
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
    </>
  )
}

export type Duration = DurationStructOutput & {
  apr: number,
  days: number,
}

const DataRow: React.FC<{ duration: Duration; index: number }> = ({ duration, index }) => {
  return (
    <>
      <Flex>
        <Text>{index + 1}</Text>
      </Flex>
      <Flex alignItems="center">
        <Flex marginLeft="10px">
          <Text>{duration.days} Days</Text>
        </Flex>
      </Flex>
      <Text fontWeight={400}>{formatAmount(duration.apr, { notation: 'standard' })}%</Text>
    </>
  )
}

const AprTable: React.FC<{
  durations: Duration[]
  loading: boolean
}> = ({ durations, loading }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const chunkSize = isMobile ? 1 : 2;

  const chunkedDurations = useMemo(() => {
    const durations_: Duration[][] = [];
    for (let i = 0; i < durations.length; i += chunkSize) {
      durations_.push(durations.slice(i, i + chunkSize))
    }
    return durations_
  }, [durations, chunkSize]);

  const TableHeader = () => (
    <>
      <Text color="secondary" fontSize="12px" bold>
        #
      </Text>
      <ClickableColumnHeader
        color="secondary"
        fontSize="12px"
        bold
        textTransform="uppercase"
      >
        {t('Duration')}
      </ClickableColumnHeader>
      <ClickableColumnHeader
        color="secondary"
        fontSize="12px"
        bold
        textTransform="uppercase"
      >
        {t('APR')}
      </ClickableColumnHeader>
    </>
  )

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <TableHeader />
        {!isMobile && <TableHeader />}
      </ResponsiveGrid>

      <Break />
      {loading ? (
        <>
          <TableLoader isMobile={isMobile} />
          <Box />
        </>
      ) : (
        <>
          {chunkedDurations.map((chunk, index) => {
            return (
              <React.Fragment key={chunk.reduce((prev, cur) => prev + cur.duration.toString(), '')}>
                <ResponsiveGrid>
                  {chunk.map((duration, index_) => {
                    if (duration) {
                      return (
                        <React.Fragment key={duration.duration.toString()}>
                          <DataRow index={chunkSize * index + index_} duration={duration} />
                        </React.Fragment>
                      )
                    }
                    return null
                  })}
                </ResponsiveGrid>
                <Break />
              </React.Fragment>
            )
          })}
        </>
      )}
    </TableWrapper>
  )
}

export default AprTable
