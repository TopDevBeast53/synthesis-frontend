import React, { useState, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { Flex, Button, Card, Text, Heading, AutoRenewIcon } from 'uikit'
import styled from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import ReferralRegisterABI from 'config/abi/HelixReferral.json'
import { getReferralRegisterAddress } from 'utils/addressHelpers'
import QuestionHelper from '../../../components/QuestionHelper'
import useToast from '../../../hooks/useToast'

const HelixReferralRegisterAddress = getReferralRegisterAddress()

const useRegisterReferral = (referrerAddress: string) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addRefCb = useCallback(async () => {
    const contract = new Contract(
      HelixReferralRegisterAddress,
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    const tx = await callWithGasPrice(contract, 'addReferrer', [referrerAddress])
    return tx.wait()
  }, [callWithGasPrice, referrerAddress, library, account])
  return addRefCb
}

type Props = {
  referrerAddress: string
}

const BodyWrapper = styled(Card)`
  border-radius: 12px;
  max-width: 690px;
  width: 100%;
  height: fit-content;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 32px;
  padding-bottom: 24px;
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

function truncateAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`
}

export default function ConfirmReferral(props: Props) {
  const { account } = useActiveWeb3React()
  const [redirect, setRedirect] = useState(false)
  const { referrerAddress } = props
  const { toastError, toastSuccess } = useToast()
  const displayAddress = truncateAddress(referrerAddress)
  const addReferrerCallback = useRegisterReferral(referrerAddress)
  const [pendingTx, setPendingTx] = useState(false)

  const handleConfirm = async () => {
    if (referrerAddress === account) {
      toastError('Error', 'This referrer account is same as your account.')
    } else {
      setPendingTx(true)
      try {
        await addReferrerCallback()
        toastSuccess('Success', 'Referral has been successfully registered!')
        setPendingTx(false)
        setRedirect(true)
      } catch (e: any) {
        const message: string = e?.data?.message
          ? e?.data?.message
          : 'Please try again if you have not been referred before.'
        toastError('Error', message)
        setPendingTx(false)
      }
    }
  }
  if (redirect) {
    return <Redirect to="/referrals" />
  }

  return (
    <AppBody>
      <Flex justifyContent="center">
        <Heading as="h1" mb="18px" color="primary" style={{ fontSize: 32 }}>
          Accept referral request from {displayAddress}?
        </Heading>
      </Flex>
      <Flex justifyContent="center" mb="18px">
        <Text fontSize="20px">
          By accepting this referral request, {displayAddress} will be rewarded <b>5%</b> when you swap/trade.
        </Text>
        <Flex alignItems="center">
          <QuestionHelper
            text={
              <Text fontSize="16px">
                Whenever you are exchanging tokens or receiving staking rewards, Helix Treasury will give 5% of that
                amount to {displayAddress}. For example, if you have claimed 200 HELIX rewards from staking, Helix
                Treasury will mint 10 HELIX to {displayAddress} and 1 HELIX will go to you, making your profits equal to
                201 HELIX.
              </Text>
            }
            placement="auto"
          />
        </Flex>
      </Flex>
      <Flex justifyContent="center" mb="8px">
        <Flex flex={1} mr="30px">
          <Button onClick={() => setRedirect(true)} variant="secondary" disabled={pendingTx} width="100%">
            <Text color="white">Decline</Text>
          </Button>
        </Flex>
        <Flex flex={1}>
          <Button
            onClick={handleConfirm}
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            width="100%"
          >
            <Text bold color="black">
              Accept
            </Text>
          </Button>
        </Flex>
      </Flex>
    </AppBody>
  )
}
