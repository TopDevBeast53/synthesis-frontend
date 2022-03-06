import React, { useState, useCallback } from 'react'
import { InjectedModalProps, ModalContainer, ModalHeader, ModalBody, ModalTitle, ModalCloseButton, Heading, Button } from 'uikit'
import styled from 'styled-components'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import AddressInputPanel from './AddressInputPanel'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'

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
    const { bridgeToSolana } = useAuraNFTBridge()

    const onChangeDestination = useCallback((value:string) => {
        setDestination(value)
    }, [setDestination])

    const handleBridge = useCallback(async () => {
        try {
          const receipt = await bridgeToSolana(tokenIDToBridge, destination)
          if (receipt.status){
            toastSuccess('Success', 'Bridged to solana!')
          }
        } catch (e) {
          logError(e)
          toastError('Error', 'Please try again.')
        }
      }, [bridgeToSolana, tokenIDToBridge, destination, toastSuccess, toastError])


    return (
        <ModalContainer minWidth="300px">
            <ModalHeader>
				<ModalTitle>
					<Heading>
                        Bridge NFT from Binance wallet to provided Solana address
					</Heading>
				</ModalTitle>
                <ModalCloseButton onDismiss={onDismiss} />
			</ModalHeader>
            <StyledModalBody>
                <AddressInputPanel value={destination} onChange={onChangeDestination} />
                <Button 
                    onClick={handleBridge} 
                    disabled={destination.length !== 44} 
                    style={{marginTop: '16px'}}
                >
                    {
                        destination.length !== 44
                        ? "Enter valid Solana address"
                        : "Bridge"
                    }
                </Button>
            </StyledModalBody>
        </ModalContainer>
    )
}

export default BridgeToSolanaModal;