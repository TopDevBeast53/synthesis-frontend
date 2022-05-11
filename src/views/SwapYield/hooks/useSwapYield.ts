import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import yieldSwapABI from 'config/abi/HelixYieldSwap.json'
import { yieldSwapAddress } from '../constants'

export const useYieldSwap = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const getYieldSwapContract = useCallback(() => {
        return new Contract(yieldSwapAddress, yieldSwapABI, getProviderOrSigner(library, account))
    }, [library, account])

    const openSwap = useCallback(
        async (exToken, poolId, amount, ask, lockDuration) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'openSwap', [
                exToken,
                poolId,
                amount,
                ask,
                lockDuration,
            ])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const setAsk = useCallback(
        async (swapId, ask) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'setAsk', [swapId, ask])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const closeSwap = useCallback(
        async (swapId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'closeSwap', [swapId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const makeBid = useCallback(
        async (swapId, amount) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'makeBid', [swapId, amount])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const setBid = useCallback(
        async (bidId, amount) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'setBid', [bidId, amount])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const acceptBid = useCallback(
        async (bidId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'acceptBid', [bidId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const acceptAsk = useCallback(
        async (swapId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'acceptAsk', [swapId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const withdraw = useCallback(
        async (swapId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'withdraw', [swapId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const getMaxBid = useCallback(
        async (swapId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'getMaxBid', [swapId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const getSwapIds = useCallback(
        async (address) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'getSwapIds', [address])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const getBidIds = useCallback(
        async (address) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'getBidIds', [address])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const getSwapId = useCallback(async () => {
        const tx = await callWithGasPrice(getYieldSwapContract(), 'getSwapId', [])
        return tx.wait()
    }, [getYieldSwapContract, callWithGasPrice])

    const getBidId = useCallback(async () => {
        const tx = await callWithGasPrice(getYieldSwapContract(), 'getBidId', [])
        return tx.wait()
    }, [getYieldSwapContract, callWithGasPrice])

    const getSwap = useCallback(
        async (swapId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'getSwap', [swapId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const getBid = useCallback(
        async (bidId) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'getBid', [bidId])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const applySellerFee = useCallback(
        async (amount) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'applySellerFee', [amount])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    const applyBuyerFee = useCallback(
        async (amount) => {
            const tx = await callWithGasPrice(getYieldSwapContract(), 'applyBuyerFee', [amount])
            return tx.wait()
        },
        [getYieldSwapContract, callWithGasPrice],
    )

    return {
        openSwap,
        setAsk,
        closeSwap,
        makeBid,
        setBid,
        acceptBid,
        acceptAsk,
        withdraw,
        getMaxBid,
        getSwapIds,
        getBidIds,
        getSwapId,
        getBidId,
        getSwap,
        getBid,
        applySellerFee,
        applyBuyerFee,
    }
}
