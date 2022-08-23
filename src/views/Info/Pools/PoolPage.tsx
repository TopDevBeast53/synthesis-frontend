/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import {
  Text,
  Flex,
  Box,
  Button,
  Card,
  Breadcrumbs,
  Heading,
  Spinner,
  LinkExternal,
  useMatchBreakpoints,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from 'uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { getEtherScanLink } from 'utils'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import { usePoolDatas, usePoolChartData, usePoolTransactions } from 'state/info/hooks'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import { useWatchlistPools } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
import { BASE_SCAN_NAMES } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;
  margin-top: 16px;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const LockedTokensContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 12px;
  max-width: 280px;
`

const PoolPage: React.FC<RouteComponentProps<{ address: string }>> = ({
  match: {
    params: { address: routeAddress },
  },
}) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [showWeeklyData, setShowWeeklyData] = useState(0)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {},
  )

  // Needed to scroll up if user comes to this page by clicking on entry in the table
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.split('-')[0].toLowerCase()
  const chainId = Number(routeAddress.split('-')[1])
  const { chainId: urlChainId } = useActiveWeb3React()

  const poolData = usePoolDatas([routeAddress])[0]
  const chartData = usePoolChartData(routeAddress)
  const transactions = usePoolTransactions(routeAddress)

  const [watchlistPools, addPoolToWatchlist] = useWatchlistPools()

  return (
    <Page symbol={poolData ? `${poolData?.token0.symbol} / ${poolData?.token1.symbol}` : null}>
      {poolData ? (
        <>
          <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
            <Breadcrumbs mb="32px">
              <Link to={`/data?chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                <Text color="primary">{t('Data')}</Text>
              </Link>
              <Link to={`/data/trading-pools?chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                <Text color="primary">{t('Trading Pools')}</Text>
              </Link>
              <Flex>
                <Text mr="8px">{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</Text>
              </Flex>
            </Breadcrumbs>
            <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
              <LinkExternal mr="8px" href={getEtherScanLink(address, 'address', chainId)}>
                {t(`View on ${BASE_SCAN_NAMES[chainId]}`)}
              </LinkExternal>
              <SaveIcon fill={watchlistPools.includes(address)} onClick={() => addPoolToWatchlist(address)} />
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb={['8px', null]}>
              <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} size={32} />
              <Text
                ml="38px"
                bold
                fontSize={isXs || isSm ? '24px' : '40px'}
                id="info-pool-pair-title"
              >{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</Text>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection={['column', 'column', 'row']} mb={['8px', '8px', null]}>
                <Link to={`/data/token/${poolData.token0.address}?chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                  <TokenButton>
                    <CurrencyLogo address={poolData.token0.address} size="24px" />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: true,
                      })} ${poolData.token1.symbol}`}
                    </Text>
                  </TokenButton>
                </Link>
                <Link to={`/data/token/${poolData.token1.address}?chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                  <TokenButton ml={[null, null, '10px']}>
                    <CurrencyLogo address={poolData.token1.address} size="24px" />
                    <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
                      {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, {
                        notation: 'standard',
                        displayThreshold: 0.001,
                        tokenPrecision: true,
                      })} ${poolData.token0.symbol}`}
                    </Text>
                  </TokenButton>
                </Link>
              </Flex>
              <Flex>
                {urlChainId === chainId && (
                  <>
                    <Link to={`/add/${poolData.token0.address}/${poolData.token1.address}?chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                      <Button mr="8px" variant="secondary">
                        {t('Add Liquidity')}
                      </Button>
                    </Link>
                    <Link to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}&chain=${CHAIN_IDS_TO_NAMES[chainId]}`}>
                      <Button>{t('Trade')}</Button>
                    </Link>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
          <ContentLayout>
            <Box>
              <Card>
                <Box p="24px">
                  <Flex justifyContent="space-between">
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
                        {t('Liquidity')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${formatAmount(poolData.liquidityUSD)}
                      </Text>
                      <Percent value={poolData.liquidityUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
                        {t('LP reward APR')}
                      </Text>
                      <Text fontSize="24px" bold>
                        {formatAmount(poolData.lpApr7d)}%
                      </Text>
                      <Flex alignItems="center">
                        <span ref={targetRef}>
                          <HelpIcon color="textSubtle" />
                        </span>
                        <Text ml="4px" fontSize="12px" color="textSubtle">
                          {t('7D performance')}
                        </Text>
                        {tooltipVisible && tooltip}
                      </Flex>
                    </Flex>
                  </Flex>
                  <Text color="secondary" bold mt="24px" fontSize="12px" textTransform="uppercase">
                    {t('Total Tokens Locked')}
                  </Text>
                  <LockedTokensContainer>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token0.address} size="24px" />
                        <Text small color="textSubtle" ml="8px">
                          {poolData.token0.symbol}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken0)}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Flex>
                        <CurrencyLogo address={poolData.token1.address} size="24px" />
                        <Text small color="textSubtle" ml="8px">
                          {poolData.token1.symbol}
                        </Text>
                      </Flex>
                      <Text small>{formatAmount(poolData.liquidityToken1)}</Text>
                    </Flex>
                  </LockedTokensContainer>
                </Box>
              </Card>
              <Card mt="16px">
                <Flex flexDirection="column" p="24px">
                  <ButtonMenu
                    activeIndex={showWeeklyData}
                    onItemClick={(index) => setShowWeeklyData(index)}
                    scale="sm"
                    variant="subtle"
                  >
                    <ButtonMenuItem width="100%">{t('24H')}</ButtonMenuItem>
                    <ButtonMenuItem width="100%">{t('7D')}</ButtonMenuItem>
                  </ButtonMenu>
                  <Flex mt="24px">
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('Volume 7D') : t('Volume 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.volumeUSDWeek) : formatAmount(poolData.volumeUSD)}
                      </Text>
                      <Percent value={showWeeklyData ? poolData.volumeUSDChangeWeek : poolData.volumeUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('LP reward fees 7D') : t('LP reward fees 24H')}
                      </Text>
                      <Text fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.lpFees7d) : formatAmount(poolData.lpFees24h)}
                      </Text>
                      <Text color="textSubtle" fontSize="12px">
                        {t('out of $%totalFees% total fees', {
                          totalFees: showWeeklyData
                            ? formatAmount(poolData.totalFees7d)
                            : formatAmount(poolData.totalFees24h),
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            </Box>
            <ChartCard variant="pool" chartData={chartData} />
          </ContentLayout>
          <Heading mb="16px" mt="40px" scale="lg">
            {t('Transactions')}
          </Heading>
          <TransactionTable transactions={transactions} />
        </>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default PoolPage
