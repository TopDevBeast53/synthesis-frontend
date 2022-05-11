import React, { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Flex, Button, Card, Text } from 'uikit'
import { Contract } from '@ethersproject/contracts'
import ReferralRegisterABI from 'config/abi/HelixReferral.json'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import tokens from 'config/constants/tokens'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { getReferralRegisterAddress } from 'utils/addressHelpers'
import ConfirmReferral from './components/ConfirmReferral'
import Page from '../Page'
import useToast from '../../hooks/useToast'
import CircleLoader from '../../components/Loader/CircleLoader'
import CopyAddress from '../../components/Menu/UserMenu/CopyAddress'

const HelixReferralRegisterAddress = getReferralRegisterAddress()

const useGetRef = (account: string | null) => {
  const { library } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = new Contract(
      HelixReferralRegisterAddress,
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    if (!account) return null
    const result = await contract.ref(account)
    return result
  }, [library, account])
}

const useGetBalance = (account: string | null) => {
  const { library } = useActiveWeb3React()
  return useCallback(async () => {
    const contract = new Contract(
      HelixReferralRegisterAddress,
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    if (!account) return null
    const result = await contract.balance(account)
    return result
  }, [library, account])
}

const BodyWrapper = styled(Card)`
  border-radius: 30px;
  max-width: 500px;
  width: 100%;
  height: fit-content;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 32px;
  padding-bottom: 16px;
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

const useClaimRewards = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addRefCb = useCallback(async () => {
    const contract = new Contract(
      HelixReferralRegisterAddress,
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    const tx = await callWithGasPrice(contract, 'withdraw', [])
    const result = await tx.wait()
    return result
  }, [callWithGasPrice, library, account])
  return addRefCb
}

function getReferralLink(address: string): string {
  return `${window.location.hostname}/referrals?ref=${address}`
}

function formatBalance(bal: string): string {
  const prefix = bal.substring(0, bal.length - 18)
  const suffix = bal.substring(bal.length - 18, bal.length - 15)
  return `${prefix}.${suffix}`
}

export default function Referrals() {
  const { account } = useActiveWeb3React()
  const getRef = useGetRef(account)
  const getBalance = useGetBalance(account)
  const [myReferrer, setMyReferrer] = useState<string | null>(null)
  const { toastError, toastSuccess } = useToast()
  const [disabled, setDisabled] = useState(false)
  const [isReferrerLoading, setIsReferrerLoading] = useState(true)
  const [isBalanceLoading, setIsBalanceLoading] = useState(true)
  const [pendingBalance, setPendingBalance] = useState<string>('0')
  const [reloadBalance, setReloadBalance] = useState(true)
  const location = useLocation()
  const claimRewardsCb = useClaimRewards()
  const helixToken = tokens.helix
  const { search } = location
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
  }, [getRef])
  useEffect(() => {
    if (reloadBalance) {
      getBalance().then((value) => {
        if (value === null) {
          return
        }
        const currentVal = value.toString()
        if (currentVal === '0') {
          setPendingBalance('0')
        } else {
          setPendingBalance(formatBalance(currentVal))
        }
        setIsBalanceLoading(false)
        setReloadBalance(false)
      })
    }
  }, [reloadBalance, getBalance])

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
  const ref = new URLSearchParams(search).get('ref')
  const showAcceptReferral = ref && !myReferrer && !isReferrerLoading
  return (
    <Page>
      {showAcceptReferral && <ConfirmReferral referrerAddress={ref} />}
      {!showAcceptReferral && (
        <AppBody>
          <Text fontSize="32px" color="white" bold>
            Referrals Hub
          </Text>
          <Flex flexDirection="column" style={{ paddingTop: '18px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referral Link
            </Text>
            <CopyAddress account={getReferralLink(account)} mb="24px" />
          </Flex>
          <Flex flexDirection="column">
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referral Rewards
            </Text>
            <Flex style={{ paddingTop: '4px' }} alignItems="center">
              <CurrencyLogo size="48px" currency={helixToken} style={{ marginRight: '8px' }} />
              {isBalanceLoading && <CircleLoader size="30px" style={{ marginLeft: '12px', marginRight: '12px' }} />}
              {!isBalanceLoading && (
                <Text bold fontSize="24px" style={{ marginLeft: '12px', marginRight: '14px' }}>
                  {pendingBalance}
                </Text>
              )}
              <Button
                onClick={async () => {
                  setDisabled(true)
                  try {
                    await claimRewardsCb()
                    toastSuccess('Success', 'Rewards have been claimed successfully!')
                    setDisabled(false)
                    setReloadBalance(true)
                  } catch (e: any) {
                    const message: string = e?.data?.message
                      ? e?.data?.message
                      : 'Please try again if you have not been referred before.'
                    toastError('Error', message)
                    setDisabled(false)
                  }
                }}
                disabled={disabled || isBalanceLoading || pendingBalance === '0'}
              >
                <Text bold color="black">
                  Claim
                </Text>
              </Button>
            </Flex>
          </Flex>
          <Flex flexDirection="column" style={{ paddingTop: '18px' }}>
            <Text color="secondary" fontSize="13px" textTransform="uppercase" fontWeight="bold" mb="8px">
              Your Referrer Address
            </Text>
            {!isReferrerLoading && <CopyAddress account={myReferrer || 'None'} mb="24px" />}
            {isReferrerLoading && <CircleLoader size="30px" style={{ marginLeft: '4px' }} />}
          </Flex>
        </AppBody>
      )}
    </Page>
  )
}
