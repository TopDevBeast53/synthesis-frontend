import React, { useState, useCallback } from 'react'
import { Redirect } from 'react-router-dom'

import { Flex, Button, Card, Text, Heading } from 'uikit'
import styled from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import ReferralRegisterABI from 'config/abi/HelixReferral.json'
import { getReferralRegisterAddress } from 'utils/addressHelpers'
import QuestionHelper from '../../../components/QuestionHelper'
import useToast from '../../../hooks/useToast'
import CircleLoader from '../../../components/Loader/CircleLoader'

const HelixReferralRegisterAddress = getReferralRegisterAddress()

export const useRegisterReferral = (referrerAddress: string) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addRefCb = useCallback(async () => {
    const contract = new Contract(
      HelixReferralRegisterAddress,
      ReferralRegisterABI,
      getProviderOrSigner(library, account),
    )
    const tx = await callWithGasPrice(contract, 'addRef', [referrerAddress])
    return tx.wait()
  }, [callWithGasPrice, referrerAddress, library, account])
  return addRefCb
}

type Props = {
  referrerAddress: string
}

const BodyWrapper = styled(Card)`
  border-radius: 30px;
  max-width: 690px;
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

function truncateAddress(address: string): string {
  return `${address.substring(0, 4)}...${address.substring(address.length - 3, address.length)}`
}

export default function ConfirmReferral(props: Props) {
  const [redirect, setRedirect] = useState(false)
  const { referrerAddress } = props
  const { toastError, toastSuccess } = useToast()
  const [disabled, setDisabled] = useState(false)
  const displayAddress = truncateAddress(referrerAddress)
  const addReferrerCallback = useRegisterReferral(referrerAddress)

  if (redirect) {
    return <Redirect to="/referrals" />
  }

  return (
    <AppBody>
      <Flex justifyContent="center">
        <Heading as="h1" mb="14px" color="primary" style={{ fontSize: 34 }}>
          Accept referral request from {displayAddress}?
        </Heading>
      </Flex>
      <Flex justifyContent="center">
        <Text fontSize="22px" color="secondary" mb="8px" ml="4px">
          By accepting this referral request, {displayAddress} will be rewarded <b>10%</b> when you swap/trade.
        </Text>
        <Flex alignItems="center" style={{ marginLeft: '2px' }}>
          <QuestionHelper
            text={
              <Text fontSize="18px" color="secondary" mb="8px" ml="4px">
                Whenever you are exchanging tokens or receiving staking rewards, Helix Treasury will give 5% of that
                amount to {displayAddress}. For example, if you have claimed 200 HELIX rewards from staking, Helix
                Treasury will mint 10 HELIX to {displayAddress} and 1 HELIX will go to you, making your profits equal to
                201 HELIX.
              </Text>
            }
            mr="4px"
            placement="top-end"
          />
        </Flex>
      </Flex>
      {disabled && (
        <Flex justifyContent="center" style={{ paddingTop: '6px', paddingBottom: '6px' }}>
          <CircleLoader size="28px" />
        </Flex>
      )}
      <Flex justifyContent="center" style={{ paddingTop: '6px' }}>
        <Button
          onClick={async () => {
            setDisabled(true)
            try {
              await addReferrerCallback()
              toastSuccess('Success', 'Referral has been successfully registered!')
              setDisabled(false)
              setRedirect(true)
            } catch (e: any) {
              const message: string = e?.data?.message
                ? e?.data?.message
                : 'Please try again if you have not been referred before.'
              toastError('Error', message)
              setDisabled(false)
            }
          }}
          disabled={disabled}
        >
          <Text bold color="black">
            Accept
          </Text>
        </Button>
        <div style={{ width: '14px' }} />
        <Button onClick={() => setRedirect(true)} variant="tertiary" disabled={disabled}>
          <Text color="white">Decline</Text>
        </Button>
      </Flex>
    </AppBody>
  )
}
