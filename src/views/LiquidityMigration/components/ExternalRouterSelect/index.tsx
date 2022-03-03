import React from 'react'
import { Button, ChevronDownIcon, Text, useModal } from 'uikit'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { Token } from 'sdk';

import type { ExternalRouterData } from 'config/constants/externalRouters';

import externalRouters from 'config/constants/externalRouters'
import { RouterLogo } from 'components/Logo';
import Row from 'components/Layout/Row';
import ExternalRouterSelectModal from '../ExternalRouterSelectModal';

const ExternalRouterSelectButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.input};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: none;
    border-radius: 4px;
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

    const savedExternalRouters = 
        useSelector<AppState, AppState['user']['externalRouters']>(
            ({ user: { externalRouters: router } }) => router)

    const savedExternalRoutes = 
        savedExternalRouters.map(router => ({
            ...router,
            pairToken: new Token(
                router.pairToken.chainID,
                router.pairToken.address,
                18,
                router.pairToken.symbol,
                router.pairToken.name,
            )
        }))

    const externalRouterName = 
        externalRouters
            .concat(savedExternalRoutes)
            .filter(externalDex => 
                externalDex.pairToken.address === externalRouter?.pairToken?.address &&
                externalDex.factoryAddress === externalRouter.factoryAddress
            )
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
