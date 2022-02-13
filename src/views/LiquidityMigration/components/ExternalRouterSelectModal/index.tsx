import React, { useCallback } from 'react'
import {
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalCloseButton,
    ModalBody,
    InjectedModalProps,
    Heading,
    Box,
} from 'uikit'
import styled from 'styled-components'

import type { ExternalRouterData } from 'config/constants/externalRouters';

import ExternalRouterList from '../ExternalRouterList';

const StyledModalContainer = styled(ModalContainer)`
    max-width: 420px;
    width: 100%;
`

const StyledModalBody = styled(ModalBody)`
    padding: 24px;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      	display: none;
    }
`

interface ExternalRouterSelectModalProps extends InjectedModalProps {
    onExternalRouterSelect: (externalRouter: ExternalRouterData) => void,
    externalRouter?: ExternalRouterData | null,
}

const ExternalRouterSelectModal: React.FC<ExternalRouterSelectModalProps> = ({
	onDismiss = () => null,
	onExternalRouterSelect,
	externalRouter
}) => {
	const handleExternalRouteSelect = useCallback(
		(selectedExternalRouter: ExternalRouterData) => {
		onDismiss()
		onExternalRouterSelect(selectedExternalRouter)
		},
		[onDismiss, onExternalRouterSelect],
	)

	return (
		<StyledModalContainer minWidth="320px">
			<ModalHeader>
				<ModalTitle>
					<Heading>
						Select an external router
					</Heading>
				</ModalTitle>
				<ModalCloseButton onDismiss={onDismiss} />
			</ModalHeader>
			<StyledModalBody>
				<Box margin="24px -24px">
					<ExternalRouterList 
						height={390}
						onExternalRouterSelect={handleExternalRouteSelect}
						externalRouter={externalRouter}
					/>
				</Box>
			</StyledModalBody>
		</StyledModalContainer>
	)
}

export default ExternalRouterSelectModal;