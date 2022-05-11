import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { Contract } from '@ethersproject/contracts'

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import helixPairABI from 'config/abi/HelixPair.json'

export const useSplitPair = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const handleSplitPair = useCallback(
        async (pairAddress) => {
            const contract = new Contract(pairAddress, helixPairABI, getProviderOrSigner(library, account))
            const addressTokenA = await callWithGasPrice(contract, 'token0', [])
            const addressTokenB = await callWithGasPrice(contract, 'token1', [])
            return [addressTokenA, addressTokenB]
        },
        [callWithGasPrice, library, account],
    )

    return { splitPair: handleSplitPair }
}
