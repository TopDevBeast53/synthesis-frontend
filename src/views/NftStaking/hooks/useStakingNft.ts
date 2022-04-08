import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import helixChefNFTABI from 'config/abi/HelixChefNFT.json'
import { helixNFTChefAddress } from '../constants'

export const useStakingNft = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getHelixChefNFTContract = useCallback(() => {
    return new Contract(helixNFTChefAddress, helixChefNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const stakingNft = useCallback(async (tokenIds:number[], isStaking:boolean) => {
    const tx = await callWithGasPrice(getHelixChefNFTContract(), isStaking?'stake':'unstake', [tokenIds])
    return tx.wait()
  }, [getHelixChefNFTContract, callWithGasPrice])

  const getPendingReward = useCallback(async () => {
    const tx:any = await callWithGasPrice(getHelixChefNFTContract(), 'pendingReward', [account])
    if (tx.length === 2)
      return formatBigNumber(ethers.BigNumber.from(tx[1].toString()))
    return '0'
  }, [getHelixChefNFTContract, callWithGasPrice, account])
  
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
