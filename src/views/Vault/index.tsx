import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { useGetTokens } from 'hooks/useGetTokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useHelix, useHelixVault } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { useFastFresh } from 'hooks/useRefresh'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { Deposit } from 'state/types'
import styled from 'styled-components'
import { Button, Flex, Heading, useModal, Text, AutoRenewIcon } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import { getHelixVaultAddress } from 'utils/addressHelpers'
import { getVaultApr } from 'utils/apr'
import CircleLoader from '../../components/Loader/CircleLoader'
import AddRowModal from './components/AddRowModal'
import VaultsTable from './components/VaultsTable/VaultsTable'
import NotEnoughTokensModal from './components/VaultCard/Modals/NotEnoughTokensModal'
import AprTableContainer from './components/AprTableContainer'

const TableControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0px;
    margin-bottom: 0;
    padding-top: 0px;
  }
`
enum HelixEnabledState {
  UNKNOWN,
  ENABLED,
  DISABLED,
}

const Vault: React.FC = () => {
  const { t } = useTranslation()
  const tokens = useGetTokens()
  const { account, chainId } = useActiveWeb3React()
  const helixContract = useHelix()
  const helixVaultContract = useHelixVault()
  const [helixEnabled, setHelixEnabled] = useState(HelixEnabledState.UNKNOWN)
  const [isLoading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [totalStake, setTotalStake] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)
  const [tokenPerBlock, setTokenPerBlock] = useState(0)
  const [totalStakedVault, setTotalStakedVault] = useState(0)

  const fastRefresh = useFastFresh()
  const { decimals } = tokens.helix
  const helixPrice = usePriceHelixBusd()

  const { balance: helixBalance, fetchStatus: balanceFetchStatus } = useTokenBalance(tokens.helix.address)
  const stakingTokenBalance = balanceFetchStatus === FetchStatus.Fetched ? helixBalance : BIG_ZERO
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol="HELIX" />)

  const totalStakeUSD = useMemo(() => {
    const total = helixPrice.multipliedBy(totalStake).toNumber();
    return Number.isNaN(total) ? '0.000' : total.toLocaleString('en');
  }, [helixPrice, totalStake])

  useEffect(() => {
    helixContract
      .balanceOf(getHelixVaultAddress(chainId))
      .then((value: any) => {
        setTotalStake(getBalanceNumber(value.toString(), decimals))
        setTotalStakedVault(Number(value.toString()))
      })
      .catch((err) => {
        logError(err)
      })
  }, [helixContract, account, setHelixEnabled, decimals, fastRefresh, chainId])

  useEffect(() => {
    helixVaultContract.getToMintPerBlock()
      .then((value: any) => {
        setTokenPerBlock(Number(value.toString()))
      })
  }, [helixVaultContract])

  useEffect(() => {
    if (!account) return
    helixContract
      .allowance(account, getHelixVaultAddress(chainId))
      .then((value) => {
        if (value.gt(0)) setHelixEnabled(HelixEnabledState.ENABLED)
        else setHelixEnabled(HelixEnabledState.DISABLED)
      })
      .catch((err) => {
        logError(err)
      })
  }, [helixContract, account, setHelixEnabled, decimals, chainId])

  const txResponseToArray = (tx) => {
    const result = tx.toString()
    if (result === '') return []
    return result.split(',')
  }

  useEffect(() => {
    if (helixEnabled && account) {
      load()
    }
    async function load() {
      const idList = await helixVaultContract.getDepositIds(account)

      const deposits_ = (await Promise.all(idList.map(id => {
        return helixVaultContract.deposits(id).then((res) => {
          const resArr = txResponseToArray(res)
          const deposit: Deposit = {
            id: Number(id),
            amount: new BigNumber(resArr[1]),
            withdrawTimeStamp: Number(resArr[4]),
            withdrawn: resArr[6] === 'true',
            weight: Number(res.weight.toString())
          }
          return deposit
        })
      }))).filter(item => item.withdrawn === false);

      setDeposits(deposits_.map(deposit => ({
        ...deposit,
        apr: getVaultApr(totalStakedVault, tokenPerBlock, deposit.weight, chainId)
      })))
      setLoading(false)
    }
  }, [helixVaultContract, account, helixEnabled, refresh, fastRefresh, tokenPerBlock, totalStakedVault, chainId])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?

  const handleAfterAdded = () => {
    setTimeout(() => {
      setRefresh(refresh + 1)
    }, 1000)
  }
  const [handleAdd] = useModal(
    <AddRowModal
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={helixPrice.toNumber()}
      tokenPerBlock={tokenPerBlock}
      totalStakedVault={totalStakedVault}
      onAdd={handleAfterAdded}
    />,
  )
  const handleEnable = useCallback(async () => {
    setPendingTx(true)
    try {
      await helixContract.approve(getHelixVaultAddress(chainId), ethers.constants.MaxUint256)
      setHelixEnabled(HelixEnabledState.ENABLED)
    } catch (e) {
      logError(e)
    }
    setPendingTx(false)
  }, [helixContract, chainId])
  const buttonScale = 'md'

  return (
    <>
      <PageHeader background="transparent">
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Vaults')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Locked, Higher Yield Staking for HELIX')}
            </Heading>
            <Heading scale="md" color="text" mt="3">
              {t('Total HELIX Vaulted: ')} {formatNumber(totalStake)} (${totalStakeUSD})
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>

      <AprTableContainer tokenPerBlock={tokenPerBlock}
        totalStakedVault={totalStakedVault} />

      {(!account) ?
        (
          <Page>
            <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>
              <Text fontSize="18px" bold>
                Connect Your Wallet...
              </Text>
            </Flex>
            <Flex justifyContent="center">
              <CircleLoader size="30px" />
            </Flex>
          </Page>
        ) : <Page>
          <TableControls>
            <Flex justifyContent="start" width={1}>
              {helixEnabled === HelixEnabledState.ENABLED && (
                <Button onClick={stakingTokenBalance.gt(0) ? handleAdd : onPresentTokenRequired} key={buttonScale} variant="secondary" scale={buttonScale} mr="8px">
                  Add Vault
                </Button>
              )}
              {helixEnabled === HelixEnabledState.DISABLED && (
                <Button
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleEnable}
                  key={buttonScale}
                  variant="secondary"
                  scale={buttonScale}
                  mr="8px"
                >
                  Enable
                </Button>
              )}
            </Flex>
          </TableControls>
          {/* {isLoading && (
            <Flex justifyContent="center" mb="4px">
              <Loading />
            </Flex>
          )} */}
          {deposits?.length === 0 && !isLoading ? (
            <Text fontSize="16px" color="#fff" pb="32px">
              {t('Create your first HELIX Vault')}
            </Text>
          ) : (
            <VaultsTable deposits={deposits} />
          )}
        </Page>}


    </>
  )
}

export default Vault
