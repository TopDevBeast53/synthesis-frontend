import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import Loading from 'components/Loading'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  useFetchAuraVault,
  useFetchIfoPool, useFetchPublicPoolsData, useFetchUserPools, usePools, useVaultPools
} from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { useUserPoolStakedOnly } from 'state/user/hooks'
import styled from 'styled-components'
import { Button, Flex, Heading, Text, useModal } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { latinise } from 'utils/latinise'
import { usePoolsWithVault } from 'views/Home/hooks/useGetTopPoolsByApr'
import AddRowModal from './components/AddRowModal'
import VaultsTable from './components/VaultsTable/VaultsTable'
import { getAuraVaultEarnings } from './helpers'



const TableControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0px;
    margin-bottom: 0;
  }
`


const NUMBER_OF_POOLS_VISIBLE = 12

const Vault: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { userDataLoaded } = usePools()
  const [stakedOnly] = useUserPoolStakedOnly()  
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [searchQuery] = useState('')
  const [sortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const vaultPools = useVaultPools()
  const auraInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalAuraInVault)
  }, BIG_ZERO)

  const pools = usePoolsWithVault()

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, vaultPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, vaultPools],
  )
  

  useFetchAuraVault()
  useFetchIfoPool(true)
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const showFinishedPools = location.pathname.includes('history')


  const sortPools = (poolsToSort: DeserializedPool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.apr : 0), 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.vaultKey
              ? getAuraVaultEarnings(
                  account,
                  vaultPools[pool.vaultKey].userData.helixAtLastUserAction,
                  vaultPools[pool.vaultKey].userData.userShares,
                  vaultPools[pool.vaultKey].pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            let totalStaked = Number.NaN
            if (pool.vaultKey) {
              if (pool.stakingTokenPrice && vaultPools[pool.vaultKey].totalAuraInVault.isFinite()) {
                totalStaked =
                  +formatUnits(
                    ethers.BigNumber.from(vaultPools[pool.vaultKey].totalAuraInVault.toString()),
                    pool.stakingToken.decimals,
                  ) * pool.stakingTokenPrice
              }
            } else if (pool.sousId === 0) {
              if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice && auraInVaults.isFinite()) {
                const manualCakeTotalMinusAutoVault = ethers.BigNumber.from(pool.totalStaked.toString()).sub(
                  auraInVaults.toString(),
                )
                totalStaked =
                  +formatUnits(manualCakeTotalMinusAutoVault, pool.stakingToken.decimals) * pool.stakingTokenPrice
              }
            } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
              totalStaked =
                +formatUnits(ethers.BigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
            return Number.isFinite(totalStaked) ? totalStaked : 0
          },
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const stakingTokenBalance = pools[0]? new BigNumber(pools[0].userData.stakingTokenBalance) : BIG_ZERO
  const stakingTokenPrice = pools[0]? pools[0].stakingTokenPrice: 0
  const [handleAdd] = useModal(<AddRowModal stakingTokenBalance={stakingTokenBalance} stakingTokenPrice= {stakingTokenPrice} />)
  const buttonScale ="md";
  return (
    <>
      <PageHeader background='transparent'>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="12px">
              {t('Helix Vaults')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Total staked 0')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <TableControls>
          <Flex justifyContent="end" width={1}>
            <Button onClick={handleAdd} key={buttonScale} variant="secondary" scale={buttonScale} mr="8px"> Add </Button>
          </Flex>
        </TableControls>
        {showFinishedPools && (
          <Text fontSize="20px" color="failure" pb="32px">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        <VaultsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />
        <div ref={observerRef} />
      </Page>
    </>
  )
}

export default Vault
