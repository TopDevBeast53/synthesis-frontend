import React, { useState, useCallback } from 'react';
import { Flex, Button, Input, Card, Text } from 'uikit'

import { AppBody } from 'components/App';   
import { AutoColumn } from 'components/Layout/Column';
import type { ExternalRouterData } from 'config/constants/externalRouters';

import { useMigrateLiquidity } from './hooks/useMigrateLiquidity';
import { useSplitPair } from './hooks/useSplitPair';
import MigrationHeaderContainer from './components/MigrationCardHeader';
import ExternalRouterSelect from './components/ExternalRouterSelect';
import Page from '../Page';

export default function Migrator() {
    const [externalRouter, setExternalRouter] = useState<ExternalRouterData | null>(null);
    const [lpToken, setLpToken] = useState('');

    const [functionCallResult, setFunctionCallResult] = useState('');
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const { splitPair } = useSplitPair();
    const { migrateLiquidity } = useMigrateLiquidity();

    const migrateLiquidityCall = useCallback(async () => {
        try {
            setIsButtonClicked(true);
            const [tokenA, tokenB] = await splitPair(lpToken);
            const tx = await migrateLiquidity(
                [tokenA, tokenB, lpToken, externalRouter.routerAddress]
            );
            setFunctionCallResult(tx);
        } catch(error) {
            setFunctionCallResult(error.toString());
        } finally {
            setIsButtonClicked(false);
        }
    }, [splitPair, migrateLiquidity, lpToken, externalRouter]);

    return (
        <Page>
            <AppBody>
                <Flex position="relative" padding="24px" flexDirection="column">
                    <MigrationHeaderContainer
                        title="Migrate Liquidity"
                        subtitle="Migrate liquidity pool tokens from other DEXs"
                    />
                    <AutoColumn style={{ padding: '1rem' }} gap="md">
                        <ExternalRouterSelect 
                            onExternalRouterSelect={setExternalRouter} 
                            externalRouter={externalRouter}
                        />

                        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" pl="8px">
                            LP Token Address
                        </Text>
                        <Input 
                            placeholder="LP Token Address"
                            value={lpToken}
                            onChange={ (evt: React.ChangeEvent<HTMLInputElement>) => setLpToken(evt.target.value)}
                            style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                        />

                        <Button onClick={migrateLiquidityCall} disabled={isButtonClicked} style={{marginBottom: '16px'}}>
                            Migrate Liquidity
                        </Button>

                        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" pl="8px">
                            Function Call Result
                        </Text>
                        <Card >
                            <Text color="textSubtle" padding="10px" style={{wordWrap: "break-word"}}>
                                {functionCallResult}
                            </Text>                                                                                                     
                        </Card>
                    </AutoColumn>
                </Flex>
            </AppBody>
        </Page>
    );
}
