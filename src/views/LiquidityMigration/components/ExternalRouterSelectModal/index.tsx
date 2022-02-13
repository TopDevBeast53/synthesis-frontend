import React, { useCallback, useState, useRef } from 'react'
import {
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalCloseButton,
    ModalBody,
    InjectedModalProps,
    Heading,
    Box,
	Input,
} from 'uikit'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import { useSelector, useDispatch } from 'react-redux'
import { AppState, AppDispatch } from 'state'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice';
import { addExternalRouter } from 'state/user/actions'
import type { ExternalRouterData } from 'config/constants/externalRouters';
import Row from 'components/Layout/Row';
import Column, { AutoColumn } from 'components/Layout/Column';
import { isAddress, getProviderOrSigner } from 'utils'
import useDebounce from 'hooks/useDebounce'
import { useToken } from 'hooks/Tokens'
import externalRouters, { externalFactoryRouteMapping } from 'config/constants/externalRouters';
import ImportRow from 'components/SearchModal/ImportRow'
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { Token } from 'sdk';
import { Contract } from '@ethersproject/contracts';
import AuraPair from 'config/abi/AuraPair.json';
// import { filterTokens, useSortedTokensByQuery } from 'components/SearchModal/filtering'

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
	const { library, account } = useActiveWeb3React();
	const { callWithGasPrice } = useCallWithGasPrice();
	const [searchQuery, setSearchQuery] = useState<string>('')
	const debouncedQuery = useDebounce(searchQuery, 200)
	const fixedList = useRef<FixedSizeList>()
	const dispatch = useDispatch<AppDispatch>()

	const searchToken = useToken(debouncedQuery)
	
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

	const handleInput = useCallback((event) => {
		const input = event.target.value
		const checksummedInput = isAddress(input)
		setSearchQuery(checksummedInput || input)
		fixedList.current?.scrollTo(0)
	}, [])

	const handleExternalRouteSelect = useCallback(
		(selectedExternalRouter: ExternalRouterData) => {
		onDismiss()
		onExternalRouterSelect(selectedExternalRouter)
		},
		[onDismiss, onExternalRouterSelect],
	)

	const setImportToken = async (token: Token) => {
		const tokenContract = new Contract(token.address, AuraPair, getProviderOrSigner(library, account));
		const tokenFactory = await callWithGasPrice(tokenContract, 'factory', []);
		const dexData = externalFactoryRouteMapping[tokenFactory.toString()];

		dispatch(addExternalRouter({externalRouter: {
			routerAddress: dexData.routerAddress,
			factoryAddress: tokenFactory.toString(),
			name: dexData.name,
			pairToken: {
				name: token.name,
				symbol: token.symbol,
				address: token.address,
				chainID: token.chainId,
			}
		}}));
	}

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
				<AutoColumn gap="16px">
					<Row>
						<Input
							id="token-search-input"
							placeholder='Search name or paste LP token address'
							scale="lg"
							autoComplete="off"
							value={searchQuery}
							onChange={handleInput}
							onKeyDown={() => {console.log("Down");}}
						/>
					</Row>
				</AutoColumn>
				{searchToken ? (
					<Column style={{ padding: '20px 0', height: '100%' }}>
						<ImportRow token={searchToken} showImportView={() => {console.log("Show");}} setImportToken={setImportToken} />
					</Column>
				) : (
					<Box margin="24px -24px">
						<ExternalRouterList 
							height={390}
							fixedListRef={fixedList}
							onExternalRouterSelect={handleExternalRouteSelect}
							externalRouter={externalRouter}
							externalRouters={savedExternalRoutes.concat(externalRouters)}
						/>
					</Box>
				)}
			</StyledModalBody>
		</StyledModalContainer>
	)
}

export default ExternalRouterSelectModal;