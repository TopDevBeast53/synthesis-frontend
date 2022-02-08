import React, { useState, useCallback } from 'react';
import { Flex, Button, Input, Card, Text, Heading} from 'uikit'

import styled from 'styled-components'
import { useMigrateLiquidity } from './hooks/useMigrateLiquidity';

import Page from '../Page';

const BodyWrapper = styled(Card)`
    border-radius: 25px;
    max-width: 800px;
    width: 100%;
    height: fit-content;
`

function AppBody({ children }: { children: React.ReactNode }) {
    return <BodyWrapper>{children}</BodyWrapper>
}

export default function Migrator() {
    const [externalRouter, setExternalRouter] = useState('');
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [lpToken, setLpToken] = useState('');

    const [functionCallResult, setFunctionCallResult] = useState('');
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const { migrateLiquidity } = useMigrateLiquidity();

    const migrateLiquidityCall = useCallback(async () => {
        try {
            setIsButtonClicked(true);
            const tx = await migrateLiquidity([tokenA, tokenB, lpToken, externalRouter]);
            setFunctionCallResult(tx);
        } catch(error) {
            setFunctionCallResult(error.toString());
        } finally {
            setIsButtonClicked(false);
        }
    }, [migrateLiquidity, tokenA, tokenB, lpToken, externalRouter]);

    return (
        <Page>
            <AppBody>
                <Flex position="relative" padding="24px" flexDirection="column">
                    <Heading as="h2" mb="14px">
                        Migrate Liquidity
                    </Heading>

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        External DEX Address
                    </Text>
                    <Input 
                        placeholder="External Router Address"
                        value={externalRouter}
                        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setExternalRouter(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Token A Address
                    </Text>
                    <Input 
                        placeholder="Token A Address"
                        value={tokenA}
                        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setTokenA(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Token B Address
                    </Text>
                    <Input 
                        placeholder="Token B Address"
                        value={tokenB}
                        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setTokenB(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        LP Token Address
                    </Text>
                    <Input 
                        placeholder="LP Token Address"
                        value={lpToken}
                        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setLpToken(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Button onClick={migrateLiquidityCall} style={{marginBottom: '16px'}}>
                        Migrate Liquidity
                    </Button>

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Function Call Result
                    </Text>
                    <Card >
                        <Text color="textSubtle" padding="10px" style={{wordWrap: "break-word"}}>
                            {functionCallResult}
                        </Text>                                                                                                     
                    </Card>
                </Flex>
            </AppBody>
        </Page>
    );
}
