import React, { useState, useCallback } from 'react'
import {
  InjectedModalProps,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalTitle,
  ModalCloseButton,
  Heading,
  Button,
  AutoRenewIcon,
} from 'uikit'
import styled from 'styled-components'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import AddressInputPanel from './AddressInputPanel'
import { useNFTBridge } from '../hooks/useNFTBridge'

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

interface BridgeToSolanaModalProps extends InjectedModalProps {
  tokenIDToBridge: string
}

const BridgeToSolanaModal: React.FC<BridgeToSolanaModalProps> = ({ tokenIDToBridge, onDismiss }) => {
  const [destination, setDestination] = useState('')
  const { toastError, toastSuccess } = useToast()
  const { bridgeToSolana } = useNFTBridge()
  const [loading, setLoading] = useState(false)

  const onChangeDestination = useCallback(
    (value: string) => {
      setDestination(value)
    },
    [setDestination],
  )

  const handleBridge = useCallback(async () => {
    setLoading(true)
    try {
      const receipt = await bridgeToSolana(tokenIDToBridge, destination)
      if (receipt.status) {
        toastSuccess('Success', 'Bridged to solana!')
      }
    } catch (e) {
      logError(e)
      toastError('Error', 'Please try again.')
    }
    setLoading(false)
    onDismiss()
  }, [bridgeToSolana, tokenIDToBridge, destination, toastSuccess, toastError, onDismiss])

  return (
    <ModalContainer minWidth="300px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Bridge NFT from Binance wallet to provided Solana address</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <AddressInputPanel value={destination} onChange={onChangeDestination} />
        <Button
          onClick={handleBridge}
          isLoading={loading}
          endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={destination.length !== 44}
          style={{ marginTop: '16px' }}
        >
          {destination.length !== 44 ? 'Enter valid Solana address' : 'Bridge'}
        </Button>
      </StyledModalBody>
    </ModalContainer>
  )
}

export default BridgeToSolanaModal
