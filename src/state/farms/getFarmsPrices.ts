import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { SerializedFarm } from 'state/types'
import getTokens from 'config/constants/tokens'
import { ChainId } from 'sdk'

const getFarmFromTokenSymbol = (
    farms: SerializedFarm[],
    tokenSymbol: string,
    preferredQuoteTokens?: string[],
): SerializedFarm => {
    const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
    const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
    return filteredFarm
}

const getFarmBaseTokenPrice = (
    chainId: ChainId,
    farm: SerializedFarm,
    quoteTokenFarm: SerializedFarm,
    wethPriceUSDC: BigNumber,
    helixPriceUSDC: BigNumber,
): BigNumber => {
    const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)
    const tokens = getTokens(chainId);

    if (tokens.helix && farm.token.symbol === tokens.helix.symbol) {
        return helixPriceUSDC
    }

    if (tokens.usdc && farm.quoteToken.symbol === tokens.usdc.symbol) {
        return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.usdt && farm.quoteToken.symbol === tokens.usdt.symbol) {
        return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.dai && farm.quoteToken.symbol === tokens.dai.symbol) {
        return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.fei && farm.quoteToken.symbol === tokens.fei.symbol) {
        return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.frax && farm.quoteToken.symbol === tokens.frax.symbol) {
        return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.weth && farm.quoteToken.symbol === tokens.weth.symbol) {
        return hasTokenPriceVsQuote ? wethPriceUSDC.times(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (tokens.helix && farm.quoteToken.symbol === tokens.helix.symbol) {
        return hasTokenPriceVsQuote ? helixPriceUSDC.times(farm.tokenPriceVsQuote) : BIG_ZERO
    }

    // We can only calculate rewards without a quoteTokenFarm for BUSD/BNB farms
    if (!quoteTokenFarm) {
        return BIG_ZERO
    }

    // Possible alternative farm quoteTokens:
    // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
    // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
    // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
    // from the BNB - pBTC price, we can calculate the PNT - BUSD price
    if (tokens.weth && quoteTokenFarm.quoteToken.symbol === tokens.weth.symbol) {
        const quoteTokenInBusd = wethPriceUSDC.times(quoteTokenFarm.tokenPriceVsQuote)
        return hasTokenPriceVsQuote && quoteTokenInBusd
            ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
            : BIG_ZERO
    }

    if (tokens.usdc && quoteTokenFarm.quoteToken.symbol === tokens.usdc.symbol) {
        const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
        return hasTokenPriceVsQuote && quoteTokenInBusd
            ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
            : BIG_ZERO
    }

    if (tokens.usdt && quoteTokenFarm.quoteToken.symbol === tokens.usdt.symbol) {
        const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
        return hasTokenPriceVsQuote && quoteTokenInBusd
            ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
            : BIG_ZERO
    }

    // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
    return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
    farm: SerializedFarm,
    quoteTokenFarm: SerializedFarm,
    wethPriceUSDC: BigNumber,
    helixPriceUSDC: BigNumber,
): BigNumber => {
    if (farm.quoteToken.symbol === 'USDC') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'USDT') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'rUSDT') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'DAI') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'FRAX') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'FEI') {
        return BIG_ONE
    }

    if (farm.quoteToken.symbol === 'WETH') {
        return wethPriceUSDC
    }

    if (farm.quoteToken.symbol === 'HELIX') {
        return helixPriceUSDC
    }

    if (farm.quoteToken.symbol === 'WRBTC') {
        return wethPriceUSDC
    }

    if (!quoteTokenFarm) {
        return BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'WETH') {
        return quoteTokenFarm.tokenPriceVsQuote ? wethPriceUSDC.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'HELIX') {
        return quoteTokenFarm.tokenPriceVsQuote ? helixPriceUSDC.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'USDC') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'USDT') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'rUSDT') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'DAI') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'FRAX') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'FEI') {
        return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    if (quoteTokenFarm.quoteToken.symbol === 'WRBTC') {
        return quoteTokenFarm.tokenPriceVsQuote ? wethPriceUSDC.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
    }

    return BIG_ZERO
}

const getFarmsPrices = (chainId: ChainId, farms: SerializedFarm[]) => {
    const wethUSDCFarm = farms.find((farm) => farm.pid === 3)
    const wethPriceUSDC = wethUSDCFarm && wethUSDCFarm.tokenPriceVsQuote ? BIG_ONE.times(wethUSDCFarm.tokenPriceVsQuote) : BIG_ZERO
    const helixWETHFarm = farms.find((farm) => farm.pid === 1)
    const helixPriceUSDC = helixWETHFarm.tokenPriceVsQuote ? wethPriceUSDC.times(helixWETHFarm.tokenPriceVsQuote) : BIG_ZERO
    let helixUSDCFarm = null
    switch (chainId) {
        case ChainId.MAINNET:
            helixUSDCFarm = farms.find((farm) => farm.pid === 11)
            break;
        case ChainId.RSK_MAINNET:
        case ChainId.RSK_TESTNET:
            helixUSDCFarm = farms.find((farm) => farm.pid === 2)
            break;
        case ChainId.BSC_MAINNET:
        case ChainId.BSC_TESTNET:
            helixUSDCFarm = farms.find((farm) => farm.pid === 2)
            break;
        default:
            helixUSDCFarm = null
    }
    const helixPriceUSDCFarm = helixUSDCFarm && helixUSDCFarm.tokenPriceVsQuote ? BIG_ONE.times(helixUSDCFarm.tokenPriceVsQuote) : BIG_ZERO
    let helixPriceUSDCAvg = helixPriceUSDC
    if (!helixPriceUSDCFarm.isEqualTo(BIG_ZERO)) {
        helixPriceUSDCAvg = helixPriceUSDCAvg.plus(helixPriceUSDCFarm).div(2)
    }
    const farmsWithPrices = farms.map((farm) => {
        const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
        const tokenPriceBusd = getFarmBaseTokenPrice(chainId, farm, quoteTokenFarm, wethPriceUSDC, helixPriceUSDCAvg)
        const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, wethPriceUSDC, helixPriceUSDCAvg)
        return {
            ...farm,
            tokenPriceBusd: tokenPriceBusd.toJSON(),
            quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
        }
    })
    return farmsWithPrices
}

export default getFarmsPrices
