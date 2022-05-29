import { Contract } from '@ethersproject/contracts'
import helixChefNFTABI from 'config/abi/HelixChefNFT.json'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useHelixNFTChef } from 'hooks/useContract'
import { useCallback } from 'react'
import { getProviderOrSigner } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { helixNFTChefAddress } from '../constants'

export const useStakingNft = () => {
    const { library, account } = useActiveWeb3React()
    const { callWithGasPrice } = useCallWithGasPrice()

    const helixNFTChefContract = useHelixNFTChef()

    const getHelixChefNFTContract = useCallback(() => {
        return new Contract(helixNFTChefAddress, helixChefNFTABI, getProviderOrSigner(library, account))
    }, [library, account])

    const stakingNft = useCallback(
        async (tokenIds: number[], isStaking: boolean) => {
            const tx = await callWithGasPrice(getHelixChefNFTContract(), isStaking ? 'stake' : 'unstake', [tokenIds])
            return tx.wait()
        },
        [getHelixChefNFTContract, callWithGasPrice],
    )

    const getPendingReward = useCallback(async () => {        
        const reward = await helixNFTChefContract.pendingReward(account)
        return formatBigNumber(reward, 3)        
    }, [helixNFTChefContract, account])

    const withdrawReward = useCallback(async () => {
        const tx = await callWithGasPrice(getHelixChefNFTContract(), 'withdrawRewardToken', [])
        return tx.wait()
    }, [getHelixChefNFTContract, callWithGasPrice])

    return {
        stakingNft,
        getPendingReward,
        withdrawReward,
    }
}
