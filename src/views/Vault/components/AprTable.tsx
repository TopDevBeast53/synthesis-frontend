import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from 'uikit'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { useTranslation } from 'contexts/Localization'
import { DurationStructOutput } from 'config/abi/types/HelixVault'

const ResponsiveGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  grid-template-columns: 20px 4fr 2fr;
  width: 100%;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 20px 4fr 3fr 20px 4fr 3fr;
  }
  
`

const DurationContainer = styled.div`
  display:grid;
  width: 100%;
  grid-template-columns: 20px 4fr 2fr;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 0.7em;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
  }
`;

const TableLoader: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const LoadingItem = (
    <DurationContainer>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </DurationContainer>
  )

  const LoadingRow = (
    <ResponsiveGrid>
      {LoadingItem}
      {!isMobile && LoadingItem}
    </ResponsiveGrid>
  )

  return (
    <>
      {LoadingRow}
      {LoadingRow}
    </>
  )
}

export type Duration = DurationStructOutput & {
  apr: number,
  days: number,
}

const DataRow: React.FC<{ duration: Duration; index: number }> = ({ duration, index }) => {
  const { t } = useTranslation()

  return (
    <DurationContainer>
      <Flex>
        <Text>{index + 1}</Text>
      </Flex>
      <Flex alignItems="center">
        <Flex marginLeft="10px">
          <Text>{duration.days} {t('Days')}</Text>
        </Flex>
      </Flex>
      <Text fontWeight={400}>{formatAmount(duration.apr, { notation: 'standard' })}%</Text>
    </DurationContainer>
  )
}

const AprTable: React.FC<{
  durations: Duration[]
  loading: boolean
}> = ({ durations, loading }) => {
  const { isMobile } = useMatchBreakpoints()
  const chunkSize = isMobile ? 1 : 2;

  const chunkedDurations = useMemo(() => {
    const durations_: Duration[][] = [];
    for (let i = 0; i < durations.length; i += chunkSize) {
      durations_.push(durations.slice(i, i + chunkSize))
    }
    return durations_
  }, [durations, chunkSize]);

  return (
    <>
      {loading ? (
        <>
          <TableLoader isMobile={isMobile} />
          <Box />
        </>
      ) : (
        <>
          {chunkedDurations.map((chunk, index) => {
            const RenderChunk = chunk.map((duration, index_) => {
              if (duration) {
                return (
                  <DataRow key={duration.duration.toString()}
                    index={chunkSize * index + index_}
                    duration={duration} />
                )
              }
              return null
            })

            return (
              <React.Fragment key={chunk.reduce((prev, cur) => prev + cur.duration.toString(), '')}>
                <ResponsiveGrid>
                  {RenderChunk}
                </ResponsiveGrid>
              </React.Fragment>
            )
          })}
        </>
      )}
    </>
  )
}

export default AprTable
