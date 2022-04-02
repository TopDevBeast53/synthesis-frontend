import React, {useState, ChangeEvent, useCallback, useMemo} from 'react'
import { Flex, Button, Input, Card, Text, Heading} from 'uikit'
import Select from 'components/Select/Select'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'


import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Contract } from '@ethersproject/contracts'

import masterChefABI from 'config/abi/masterchef.json';
import sousChefABI from 'config/abi/sousChef.json';
import auraVaultABI from 'config/abi/auraVault.json';
import auraABI from 'config/abi/aura.json';
import auraRouterV1ABI from 'config/abi/AuraRouterV1.json';
import auraFactoryABI from 'config/abi/AuraFactory.json';
import auraPairABI from 'config/abi/AuraPair.json';
import testTokenABI from 'config/abi/TestToken.json';

import { getProviderOrSigner } from 'utils'
import Page from '../Page'


const BodyWrapper = styled(Card)`
  border-radius: 25px;
  max-width: 800px;
  width: 100%;
  height: fit-content;
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

function DevTool() {
    const { library, account } = useActiveWeb3React()
    const [contractAddress, setContractAddress] = useState('0x3E54EdDd13b2909A4047188A1C7b2e4BAF7b656c');
    const [contractABIName, setContractABIName] = useState('masterChef');
    const [functionName, setFunctionName] = useState('auraToken');
    const [functionArguments, setFunctionArguments] = useState([]);
    const [contractCallResult, setContractCallResult] = useState('');

    const { callWithGasPrice } = useCallWithGasPrice()

    const callOptions = useMemo(() => ({
        gasLimit: 9999999
    }), []);

    const supportedABIs = useMemo(() => ({
        'masterChef': masterChefABI,
        'smartChef': sousChefABI,
        'auraVault': auraVaultABI,
        'aura': auraABI,
        'router': auraRouterV1ABI,
        'factory': auraFactoryABI,
        'pair': auraPairABI,
        'testToken': testTokenABI,
    }), []);

    const handleContractCall = useCallback(async () => {
        try {
        const contract = new Contract(contractAddress, supportedABIs[contractABIName], getProviderOrSigner(library, account));
        const transaction = await callWithGasPrice(
            contract,
            functionName, 
            functionArguments,
            callOptions,
        );
        setContractCallResult(transaction.toString());
        } catch (error) {
            setContractCallResult(error.toString());
        }
    }, [callOptions, callWithGasPrice, contractABIName, contractAddress, functionArguments, functionName, supportedABIs, setContractCallResult, library, account]);
    
    return (
        <Page>
            <AppBody>
                <Flex position="relative" padding="24px" flexDirection="column">
                    <Heading as="h2" mb="14px">
                        Contract Call
                    </Heading>
                    
                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Contract Address
                    </Text>
                    <Input
                        placeholder='Contract address'
                        value={contractAddress}
                        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setContractAddress(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Contract ABI
                    </Text>
                    <Select 
                        options={
                            Object.keys(supportedABIs).map(abiName => ({
                                label: abiName, 
                                value: abiName,
                            }))
                        }
                        onOptionChange={option => setContractABIName(option.value)}
                        style={{marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Contract Method
                    </Text>
                    <Input
                        placeholder='Contract function name'
                        value={functionName}
                        onChange={(evt: ChangeEvent<HTMLInputElement>) => setFunctionName(evt.target.value)}
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Contract Arguments
                    </Text>
                    <Input
                        placeholder='Function arguments'
                        value={functionArguments.join(',')}
                        onChange={(evt: ChangeEvent<HTMLInputElement>) => 
                            setFunctionArguments(
                                evt.target.value.split(',').map(v => v.trim()).filter(Boolean)
                            )
                        }
                        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
                    />

                    <Button onClick={handleContractCall} style={{marginBottom: '16px'}}> 
                        Call Contract
                    </Button>
                    
                    <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
                        Contract Call Result
                    </Text>
                    <Card >
                        <Text color="textSubtle" padding="10px" style={{wordWrap: "break-word"}}>
                            {contractCallResult}
                        </Text>
                    </Card>
                </Flex>
            </AppBody>
        </Page>
    );
}


export default DevTool; 