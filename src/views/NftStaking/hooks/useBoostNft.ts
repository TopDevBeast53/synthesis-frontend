import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import helixChefNFTABI from 'config/abi/HelixChefNFT.json'
import helixNFTABI from 'config/abi/HelixNFT.json'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { getDecimalAmount } from 'utils/formatBalance'
import { helixNFTAddress, helixNFTChefAddress } from '../constants'


export const useBoostNft = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()    

    const getHelixNFTContract = useCallback(() => {
        return new Contract(helixNFTAddress, helixNFTABI, getProviderOrSigner(library, account))
    }, [library, account])

    const getHelixChefNFTContract = useCallback(() => {
        return new Contract(helixNFTChefAddress, helixChefNFTABI, getProviderOrSigner(library, account))
    }, [library, account])

    const getLevel = useCallback(
        async (tokenId) => {
            const tx = await callWithGasPrice(getHelixNFTContract(), 'getLevel', [tokenId])
            return tx.toString()
        },
        [getHelixNFTContract, callWithGasPrice],
    )

    const getHelixPoints = useCallback(
        async (tokenId) => {
            const tx = await callWithGasPrice(getHelixNFTContract(), 'getHelixPoints', [tokenId])
            return tx.toString()
        },
        [getHelixNFTContract, callWithGasPrice],
    )

    const getremainHPToNextLevel = useCallback(
        async (tokenId) => {
            const tx = await callWithGasPrice(getHelixNFTContract(), 'remainHPToNextLevel', [tokenId])
            return tx.toString()
        },
        [getHelixNFTContract, callWithGasPrice],
    )

    const boostHelixNFT = useCallback(
        async (tokenId, amount) => {
            if (parseInt(amount) === 0) return { status: false }
            const tx = await callWithGasPrice(getHelixChefNFTContract(), 'boostHelixNFT', [
                tokenId,
                getDecimalAmount(new BigNumber(amount)).toString(),
            ])
            return tx.wait()
        },
        [getHelixChefNFTContract, callWithGasPrice],
    )

    return {
        getLevel,
        getHelixPoints,
        getremainHPToNextLevel,
        boostHelixNFT,
    }
}
