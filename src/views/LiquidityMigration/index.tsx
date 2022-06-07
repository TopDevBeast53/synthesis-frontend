import React, { useState, useEffect, useCallback } from 'react'
import { Flex, Button, Input, AutoRenewIcon, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { AppBody } from 'components/App'
import { AutoColumn } from 'components/Layout/Column'
import useToast from 'hooks/useToast'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getBalanceAmount } from 'utils/formatBalance'
import { isAddress } from 'ethers/lib/utils'
import styled from 'styled-components'
import { useMigrateLiquidity } from './hooks/useMigrateLiquidity'
import { useLpContract } from './hooks/useLpContract'
import MigrationHeaderContainer from './components/MigrationCardHeader'
import { helixMigratorAddress } from './constants'
import Page from '../Page'

const StyledInput = styled(Input)`
border: none;

${({ theme }) => theme.mediaQueries.xs} {
  font-size:12px;
}

${({ theme }) => theme.mediaQueries.sm} {
  font-size:16px;
}
`

export default function Migrator() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { migrateLiquidity } = useMigrateLiquidity()
  const { toastSuccess, toastError } = useToast()

  const [externalRouter, setExternalRouter] = useState('')
  const [lpTokenAddress, setLpTokenAddress] = useState('')
  const [token0Address, setToken0Address] = useState('')
  const [token1Address, setToken1Address] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const [allowedValue, setAllowedValue] = useState<BigNumber>(BIG_ZERO)
  const [maxBalance, setMaxBalance] = useState(BIG_ZERO)

  const { approve, getAllowance, getBalance, getTokenA, getTokenB } = useLpContract()

  const handleClick = useCallback(async () => {
    if (allowedValue.lt(maxBalance)) {
      if (isAddress(lpTokenAddress)) {
        setPendingTx(true)
        try {
          const tx = await approve(lpTokenAddress, ethers.utils.parseEther(maxBalance.minus(allowedValue).toString()))
          await tx.wait()
          toastSuccess(`${t('Success')}!`, t('Approved!'))
          setAllowedValue(maxBalance)
          setPendingTx(false)
        } catch (error) {
          toastError('Error', 'Something went wrong. Try again later.')
          setPendingTx(false)
        } finally {
          setPendingTx(false)
        }
      } else {
        toastError('Error', 'Please input LP token address.')
      }
    } else if (isAddress(externalRouter) && isAddress(lpTokenAddress) && isAddress(token0Address) && isAddress(token1Address)) {
      setPendingTx(true)
      try {
        const receipt = await migrateLiquidity(externalRouter, lpTokenAddress, token0Address, token1Address)
        if (receipt?.status) {
          setPendingTx(false)
          toastSuccess('Success', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
          setAllowedValue(BIG_ZERO)
          getBalance(lpTokenAddress).then((res) => {
            setMaxBalance(getBalanceAmount(new BigNumber(res.toString())))
          })
        } else {
          setPendingTx(false)
          toastError('Error', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        }
      } catch (error) {
        toastError('Error', 'Something went wrong. Try again later.')
        setPendingTx(false)
      } finally {
        setPendingTx(false)
      }
    } else {
      toastError('Error', 'Please input all addresses')
    }
  }, [allowedValue, approve, getBalance, maxBalance, migrateLiquidity, externalRouter, token0Address, token1Address, lpTokenAddress, t, toastError, toastSuccess])

  const handleGetInfos = useCallback(() => {
    getAllowance(lpTokenAddress).then((res) => {
      setAllowedValue(new BigNumber(res.toString()))
    })
    getBalance(lpTokenAddress).then((res) => {
      setMaxBalance(getBalanceAmount(new BigNumber(res.toString())))
    })
    getTokenA(lpTokenAddress).then((res) => {
      setToken0Address(res)
    })
    getTokenB(lpTokenAddress).then((res) => {
      setToken1Address(res)
    })
  }, [getAllowance, getBalance, getTokenA, getTokenB, lpTokenAddress])

  useEffect(() => {
    if (isAddress(lpTokenAddress) && isAddress(account)) {
      handleGetInfos()
    }
  }, [handleGetInfos, account, lpTokenAddress])

  return (
    <Page>
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <MigrationHeaderContainer
            title="Migrate Liquidity"
            subtitle="Migrate liquidity pool tokens from other DEXs"
          />
          <AutoColumn style={{ padding: '1rem' }} gap="md">
            <Flex justifyContent="space-between" pl="16px">
              <Text fontSize="14px">{t('External Router Address')}</Text>
            </Flex>
            <StyledInput value={externalRouter} onChange={e => setExternalRouter(e.target.value)} placeholder="External Router Address" isWarning={!isAddress(externalRouter)} />
            <Flex justifyContent="space-between" pl="16px">
              <Text fontSize="14px">{t('LP Token Address')}</Text>
              <Text fontSize="14px" style={{ textOverflow: "ellipsis", overflow: "hidden" }} ml="15px">{t('Balance: %balance%', { balance: maxBalance.toNumber() })}</Text>
            </Flex>
            <StyledInput value={lpTokenAddress} onChange={e => setLpTokenAddress(e.target.value)} placeholder="LP Token Address" isWarning={!isAddress(lpTokenAddress)} />
            <Flex justifyContent="space-between" pl="16px">
              <Text fontSize="14px">{t('TokenA Address')}</Text>
            </Flex>
            <StyledInput value={token0Address} onChange={e => setToken0Address(e.target.value)} placeholder="TokenA Address" isWarning={!isAddress(token0Address)} />
            <Flex justifyContent="space-between" pl="16px">
              <Text fontSize="14px">{t('TokenB Address')}</Text>
            </Flex>
            <StyledInput value={token1Address} onChange={e => setToken1Address(e.target.value)} placeholder="TokenB Address" isWarning={!isAddress(token1Address)} />
            <Button
              isLoading={pendingTx}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              onClick={handleClick}
              disabled={allowedValue.eq(BIG_ZERO) && maxBalance.eq(BIG_ZERO)}
              style={{ marginBottom: '5px' }}>
              {pendingTx ? (allowedValue.lt(maxBalance) ? 'Approving' : t('Migrating')) : allowedValue.lt(maxBalance) ? 'Approve' : t('Migrate')}
            </Button>
          </AutoColumn>
        </Flex>
      </AppBody>
    </Page>
  )
}
