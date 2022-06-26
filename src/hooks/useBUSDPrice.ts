import { ChainId, Currency, currencyEquals, JSBI, Price } from 'sdk'
import tokens, { mainnetTokens } from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const BUSD_MAINNET = mainnetTokens.usdc
const { weth: WETH } = tokens

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
    const { chainId } = useActiveWeb3React()
    const wrapped = wrappedCurrency(currency, chainId)
    const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
        () => [
            [chainId && wrapped && currencyEquals(WETH, wrapped) ? undefined : currency, chainId ? WETH : undefined],
            [
                wrapped?.equals(BUSD_MAINNET) ? undefined : wrapped,
                chainId === ChainId.MAINNET ? BUSD_MAINNET : undefined,
            ],
            [chainId ? WETH : undefined, chainId === ChainId.MAINNET ? BUSD_MAINNET : undefined],
        ],
        [chainId, currency, wrapped],
    )
    const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

    return useMemo(() => {
        if (!currency || !wrapped || !chainId) {
            return undefined
        }
        // handle weth/eth
        if (wrapped.equals(WETH)) {
            if (busdPair) {
                const price = busdPair.priceOf(WETH)
                return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
            }
            return undefined
        }
        // handle busd
        if (wrapped.equals(BUSD_MAINNET)) {
            return new Price(BUSD_MAINNET, BUSD_MAINNET, '1', '1')
        }

        const ethPairETHAmount = ethPair?.reserveOf(WETH)
        const ethPairETHBUSDValue: JSBI =
            ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(WETH).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

        // all other tokens
        // first try the busd pair
        if (
            busdPairState === PairState.EXISTS &&
            busdPair &&
            busdPair.reserveOf(BUSD_MAINNET).greaterThan(ethPairETHBUSDValue)
        ) {
            const price = busdPair.priceOf(wrapped)
            return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
        }
        if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
            if (busdEthPair.reserveOf(BUSD_MAINNET).greaterThan('0') && ethPair.reserveOf(WETH).greaterThan('0')) {
                const ethBusdPrice = busdEthPair.priceOf(BUSD_MAINNET)
                const currencyEthPrice = ethPair.priceOf(WETH)
                const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
                return new Price(currency, BUSD_MAINNET, busdPrice.denominator, busdPrice.numerator)
            }
        }

        return undefined
    }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useHelixBusdPrice = (): Price | undefined => {
    const helixBusdPrice = useBUSDPrice(tokens.helix)
    return helixBusdPrice
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
    const { chainId } = useActiveWeb3React()
    const busdPrice = useBUSDPrice(currency)
    const wrapped = wrappedCurrency(currency, chainId)
    if (busdPrice) {
        return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
    }
    return undefined
}

export const useBUSDHelixAmount = (amount: number): number | undefined => {
    const helixBusdPrice = useHelixBusdPrice()
    if (helixBusdPrice) {
        return multiplyPriceByAmount(helixBusdPrice, amount)
    }
    return undefined
}

export const useBNBBusdPrice = (): Price | undefined => {
    const bnbBusdPrice = useBUSDPrice(tokens.weth)
    return bnbBusdPrice
}
