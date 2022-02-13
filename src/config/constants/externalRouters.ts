import { ChainId, Token } from 'sdk'

const { TESTNET } = ChainId

export interface ExternalRouterData {
    routerAddress: string;
    factoryAddress: string;
    name: string;
    pairToken: Token;
}

const externalRouters: ExternalRouterData[] = [
	{
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		factoryAddress: '0xe1cf8d44bb47b8915a70ea494254164f19b7080d', 
		name: 'Test DEX - First Test Token',
		pairToken: new Token(
			TESTNET,
			'0x360f6135472195caabEA67c7C6b83E3767F96762',
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