import { ChainId, Token } from 'sdk'

const { TESTNET } = ChainId

export interface ExternalRouterData {
    routerAddress: string;
    factoryAddress: string;
    name: string;
    pairToken: Token;
}

export interface SerialisedExternalRouterData {
    routerAddress: string;
    factoryAddress: string;
    name: string;
    pairToken: {
		chainID: number;
		address: string;
		symbol: string;
		name: string;
	};
}

const externalRouters: ExternalRouterData[] = [
	{
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		factoryAddress: '0xe1cf8d44bb47b8915a70ea494254164f19b7080d', 
		name: 'Test DEX - First Test Token',
		pairToken: new Token(
			TESTNET,
			'0xa8a6586fB417E0b350d26f6f0959Ea1A638e7a1C',
			18,
			'TT1',
			'tt1',
		),
	},
	{ 
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		factoryAddress: '0xe1cf8d44bb47b8915a70ea494254164f19b7080d', 
		name: 'Test DEX - Second Test Token',
		pairToken: new Token(
			TESTNET,
			'0xd239560c0d8Ae7EB66c5f691F32a7D7857cEDc58',
			18,
			'TT2',
			'tt2',
		),
	}
]

export default externalRouters;