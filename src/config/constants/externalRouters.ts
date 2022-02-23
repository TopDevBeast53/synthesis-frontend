import { ChainId, Token } from 'sdk'

const { TESTNET, MAINNET } = ChainId

export interface ExternalRouterData {
    routerAddress: string;
    factoryAddress: string;
    name: string;
	chainID: ChainId;
    pairToken: Token;
}

export interface SerialisedExternalRouterData {
    routerAddress: string;
    factoryAddress: string;
    name: string;
	chainID: number;
    pairToken: {
		chainID: number;
		address: string;
		symbol: string;
		name: string;
	}
}

const externalRouters: ExternalRouterData[] = [
	{
		name: 'Test DEX',
		chainID: TESTNET,
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		factoryAddress: '0xe1cf8d44bb47b8915a70ea494254164f19b7080d', 
		pairToken: 
			new Token(
				TESTNET,
				'0xa8a6586fB417E0b350d26f6f0959Ea1A638e7a1C',
				18,
				'TT1',
				'tt1',
			)
	},
	{
		name: 'Test DEX',
		chainID: TESTNET,
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		factoryAddress: '0xe1cf8d44bb47b8915a70ea494254164f19b7080d', 
		pairToken: 
			new Token(
				TESTNET,
				'0xd239560c0d8Ae7EB66c5f691F32a7D7857cEDc58',
				18,
				'TT2',
				'tt2',
			),
	},

	/// APESWAP ///
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken: 
			new Token(
				MAINNET,
				'0x1E1aFE9D9c5f290d8F6996dDB190bd111908A43D',
				18, 
				'BTC-WBNB',
				'btc-wbnb',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0xA0C3Ef24414ED9C9B456740128d8E63D016A9e11',
				18, 
				'ETH-WBN',
				'ETH-WBN',
			)
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x2e707261d086687470B515B320478Eb1C88D49bb',
				18, 
				'USDT-BUSD',
				'USDT-BUSD',
			)
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
				18, 
				'WBNB-BUSD',
				'WBNB-BUSD',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x83C5b5b309EE8E232Fe9dB217d394e262a71bCC0',
				18, 
				'WBNB-USD',
				'WBNB-USD',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x744770647Ff719BedCAba5fd80525EB9cFffbd11',
				18, 
				'ADS-WBNB',
				'ADS-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914',
				18, 
				'BANANA-BUSD',
				'BANANA-BUSD',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x83CcbE832e5a3B620a435fe0eDb89e171C14eCcB',
				18, 
				'IHC-WBNB',
				'IHC-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0xC0AFB6078981629F7eAe4f2ae93b6DBEA9D7a7e9',
				18, 
				'SHIB-WBNB',
				'SHIB-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x40aFc7CBd0Dc2bE5860F0035b717d20Afb4827b2',
				18, 
				'AVAX-WBNB',
				'AVAX-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0xaa6B926156173660D57182853d546F5Fe2262439',
				18, 
				'CACTUS-WBNB',
				'CACTUS-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0x29A4A3D77c010CE100A45831BF7e798f0f0B325D',
				18, 
				'MATIC-WBNB',
				'MATIC-WBNB',
			),
	},
	{
		name: 'APESWAP',
		chainID: MAINNET,
		routerAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
		factoryAddress: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6', 
		pairToken:
			new Token(
				MAINNET,
				'0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713',
				18, 
				'BANANA-WBNB',
				'BANANA-WBNB',
			),
	},
	/// APESWAP END ///
	/// BABYSWAP ///
	{
		name: 'BABYSWAP',
		chainID: MAINNET,
		routerAddress: '0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd',
		factoryAddress: '0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da', 
		pairToken:
			new Token(
				MAINNET,
				'0x249cd054697f41d73F1A81fa0F5279fcce3cF70c',
				18, 
				'USDT-BUSD',
				'USDT-BUSD',
			),
	},
	{
		name: 'BABYSWAP',
		chainID: MAINNET,
		routerAddress: '0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd',
		factoryAddress: '0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da', 
		pairToken:
			new Token(
				MAINNET,
				'0xDF84C66E5c1E01Dc9CBcbBB09F4cE2A1De6641D6',
				18, 
				'WBNB-BUSD',
				'WBNB-BUSD',
			),
	},
	/// BABYSWAP END /// 
	/// BISWAP /// 
	{
		name: 'BISWAP',
		chainID: MAINNET,
		routerAddress: '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8',
		factoryAddress: '0x858E3312ed3A876947EA49d572A7C42DE08af7EE', 
		pairToken:
			new Token(
				MAINNET,
				'0xC7e9d76ba11099AF3F330ff829c5F442d571e057',
				18, 
				'BTCB-WBNB',
				'BTCB-WBNB',
			),
	},
	/// BISWAP END /// 
	/// MDEX /// 
	{
		name: 'MDEX',
		chainID: MAINNET,
		routerAddress: '0x0384E9ad329396C3A6A401243Ca71633B2bC4333',
		factoryAddress: '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8', 
		pairToken:
			new Token(
				MAINNET,
				'0x82E8F9e7624fA038DfF4a39960F5197A43fa76aa',
				18, 
				'ETH-WBNB',
				'ETH-WBNB',
			),
	},
	/// MDEX END /// 
	/// PANCAKESWAP /// 
	{
		name: 'PANCAKESWAP',
		chainID: MAINNET,
		routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
		factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', 
		pairToken:
			new Token(
				MAINNET,
				'0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082',
				18, 
				'BTCB-WBNB',
				'BTCB-WBNB',
			),
	},
	/// PANCAKESWAP END ///
]


export const externalFactoryRouteMapping = {
	'0xee3d4d589D7af30259283A5Cd57C25A6661A362b': {
		routerAddress: '0x7dc5ac586e26B0Ae1aF00EA26249B49b4cF33d4C',
		name: 'Test ME Today'
	}
}

export default externalRouters;