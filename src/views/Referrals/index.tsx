import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Flex, Button, Card, Text, Box, AutoRenewIcon } from 'uikit'
import { Contract } from '@ethersproject/contracts'
import ReferralRegisterABI from 'config/abi/HelixReferral.json'
import { getProviderOrSigner } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFastFresh } from 'hooks/useRefresh'
import { useGetTokens } from 'hooks/useGetTokens'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { getReferralRegisterAddress } from 'utils/addressHelpers'
import { BASE_URL } from 'config'
import ConfirmReferral from './components/ConfirmReferral'
import Page from '../Page'
import useToast from '../../hooks/useToast'
import CircleLoader from '../../components/Loader/CircleLoader'
import CopyAddress from '../../components/Menu/UserMenu/CopyAddress'

const useGetRef = (account: string | null) => {
  const { library, chainId } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = new Contract(
      getReferralRegisterAddress(chainId),
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    if (!account) return null
    const result = await contract.referrers(account)
    return result
  }, [library, account, chainId])
}

const useGetReferees = (account: string | null) => {
  const { library, chainId } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = new Contract(
      getReferralRegisterAddress(chainId),
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    if (!account) return null
    const result = await contract.getReferees(account)
    return result
  }, [library, account, chainId])
}

const useGetBalance = (account: string | null) => {
  const { library, chainId } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = new Contract(
      getReferralRegisterAddress(chainId),
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    if (!account) return null
    const result = await contract.rewards(account)
    return result
  }, [library, account, chainId])
}

const BodyWrapper = styled(Card)`
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  height: fit-content;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 32px;
  padding-bottom: 32px;
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

const useClaimRewards = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addRefCb = useCallback(async () => {
    const contract = new Contract(
      getReferralRegisterAddress(chainId),
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    const tx = await callWithGasPrice(contract, 'withdraw', [])
    const result = await tx.wait()
    return result
  }, [callWithGasPrice, library, account, chainId])
  return addRefCb
}

function getReferralLink(address: string, chain: string): string {
  return `${BASE_URL}/refer?ref=${address}&chain=${chain}`
}

export default function Referrals() {
  const { account } = useActiveWeb3React()
  const tokens = useGetTokens()
  const fastRefresh = useFastFresh()
  const getRef = useGetRef(account)
  const getReferees = useGetReferees(account)
  const getBalance = useGetBalance(account)
  const [myReferrer, setMyReferrer] = useState<string | null>(null)
  const [myReferees, setMyReferees] = useState(null)
  const { toastError, toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [isReferrerLoading, setIsReferrerLoading] = useState(true)
  const [isRefereesLoading, setIsRefereesLoading] = useState(true)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const [pendingBalance, setPendingBalance] = useState<string>('0')
  const location = useLocation()
  const claimRewardsCb = useClaimRewards()
  const helixToken = tokens.helix
  const { search } = location

  const handleClaim = async () => {
    setPendingTx(true)
    try {
      await claimRewardsCb()
      toastSuccess('Success', 'Rewards have been claimed successfully!')
      setPendingTx(false)
    } catch (e: any) {
      const message: string = e?.data?.message
        ? e?.data?.message
        : 'Please try again if you have not been referred before.'
      toastError('Error', message)
      setPendingTx(false)
    }
  }
  useEffect(() => {
    getRef().then((value) => {
      if (value === '0x0000000000000000000000000000000000000000') {
        setMyReferrer(null)
      } else {
        setMyReferrer(value)
      }
      if (value) {
        setIsReferrerLoading(false)
      }
    })
  }, [getRef, fastRefresh])

  useEffect(() => {
    getReferees().then((value) => {
      if (value === '0x0000000000000000000000000000000000000000') {
        setMyReferees(null)
      } else {
        setMyReferees(value)
      }
      if (value) {
        setIsRefereesLoading(false)
      }
    })
  }, [getReferees, fastRefresh])

  useEffect(() => {
    getBalance().then((value) => {
      if (value === null) {
        return
      }
      setPendingBalance(formatBigNumber(ethers.BigNumber.from(value), 3))
      setIsBalanceLoading(false)
    })

  }, [getBalance, fastRefresh])

  const { ref, chain } = useMemo(() => {
    const url = new URLSearchParams(search);
    return {
      ref: url.get('ref'),
      chain: url.get('chain')
    }
  }, [search])

  if (!account) {
    return (
      <Page>
        <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>
          <Text fontSize="18px" bold>
            Connect Your Wallet...
          </Text>
        </Flex>
        <Flex justifyContent="center">
          <CircleLoader size="30px" />;
        </Flex>
      </Page>
    )
  }
  const showAcceptReferral = ref && !myReferrer && !isReferrerLoading
  return (
    <Page>
      {showAcceptReferral && <ConfirmReferral referrerAddress={ref} />}
      {!showAcceptReferral && (
        <AppBody>
          <Text fontSize="32px" color="white" bold>
            Referrals Hub
          </Text>
          <Flex flexDirection="column" style={{ paddingTop: '24px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referral Link
            </Text>
            <CopyAddress account={getReferralLink(account, chain)} />
          </Flex>
          <Flex flexDirection="column" style={{ paddingTop: '24px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referral Rewards
            </Text>
            <Flex style={{ paddingTop: '4px' }} alignItems="center">
              <Flex flex={1.5} alignItems="center">
                <CurrencyLogo size="48px" currency={helixToken} style={{ marginRight: '8px' }} />
                {isBalanceLoading && <CircleLoader size="30px" style={{ marginLeft: '12px', marginRight: '12px' }} />}
                {!isBalanceLoading && (
                  <Text bold fontSize="24px" style={{ marginLeft: '12px', marginRight: '14px' }}>
                    {pendingBalance}
                  </Text>
                )}
              </Flex>
              <Flex flex={1}>
                <Button
                  variant='primary'
                  onClick={handleClaim}
                  disabled={isBalanceLoading || parseFloat(pendingBalance) === 0}
                  isLoading={pendingTx}
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  width="100%"
                >
                  Claim
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDirection="column" style={{ paddingTop: '24px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referrer Address
            </Text>
            {!isReferrerLoading && <CopyAddress account={myReferrer || 'None'} />}
            {isReferrerLoading && <CircleLoader size="30px" style={{ marginLeft: '4px' }} />}
          </Flex>
          <Flex flexDirection="column" style={{ paddingTop: '24px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referees Addresses
            </Text>
            {isRefereesLoading && <CircleLoader size="30px" style={{ marginLeft: '4px' }} />}
            {!isRefereesLoading && myReferees.length !== 0 ?
              myReferees.map((referee) => {
                return (
                  <Box mb="4px" key={referee}>
                    <CopyAddress account={referee || 'None'} />
                  </Box>
                )
              })
              : <CopyAddress account='None' />
            }
          </Flex>
        </AppBody>
      )}
    </Page>
  )
}
