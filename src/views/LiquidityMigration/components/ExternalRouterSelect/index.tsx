import React from 'react'
import { Button, ChevronDownIcon, Text, useModal } from 'uikit'
import styled from 'styled-components'

import type { ExternalRouterData } from 'config/constants/externalRouters';

import externalRouters from 'config/constants/externalRouters'
import { RouterLogo } from 'components/Logo';
import Row from 'components/Layout/Row';
import ExternalRouterSelectModal from '../ExternalRouterSelectModal';

const ExternalRouterSelectButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.input};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: none;
    border-radius: 16px;
    width: 100%;
`

interface ExternalRouterSelectPanelProps {
    onExternalRouterSelect: (externalRouter: ExternalRouterData | null) => void,
    externalRouter?: ExternalRouterData | null,
}

const ExternalRouterSelectPanel: React.FC<ExternalRouterSelectPanelProps> = ({
    onExternalRouterSelect,
    externalRouter
}) => {
    const [onPresentExternalRoutersModal] = useModal(
        <ExternalRouterSelectModal 
            onExternalRouterSelect={onExternalRouterSelect} 
            externalRouter={externalRouter}
        />
    )

    const externalRouterName = 
        externalRouters
            .filter(externalDex => externalDex.routerAddress === externalRouter?.routerAddress)
            ?.[0]
            ?.name
    
    return (
        <ExternalRouterSelectButton
            endIcon={<ChevronDownIcon />}
            onClick={onPresentExternalRoutersModal}
        >
            <Row>
                {
                    externalRouter && 
                    <RouterLogo 
                        routerAddress={externalRouter.routerAddress} 
                        size="24px" 
                        style={{ marginRight: '8px' }} 
                    />
                }
                <Text id="pair" bold>
                    {externalRouterName ?? 'Select a DEX with LP token to migrate'}
                </Text>
            </Row>
        </ExternalRouterSelectButton>
    )
}

export default ExternalRouterSelectPanel;
