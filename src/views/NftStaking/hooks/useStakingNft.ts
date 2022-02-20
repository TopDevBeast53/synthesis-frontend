import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'
import auraChefNFTABI from 'config/abi/AuraChefNFT.json'
import { auraNFTChefAddress } from '../constants'

export const useStakingNft = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const getAuraChefNFTContract = useCallback(() => {
    return new Contract(auraNFTChefAddress, auraChefNFTABI, getProviderOrSigner(library, account))
  }, [library, account])

  const stakingNft = useCallback(async (tokenIds:number[], isStaking:boolean) => {
    const tx = await callWithGasPrice(getAuraChefNFTContract(), isStaking?'stake':'unstake', [tokenIds])
    return tx.wait()
  }, [getAuraChefNFTContract, callWithGasPrice])

  const getPendingReward = useCallback(async () => {
    const tx:any = await callWithGasPrice(getAuraChefNFTContract(), 'pendingReward', [account])
    if (tx.length === 2)
      return formatBigNumber(ethers.BigNumber.from(tx[1].toString()))
    return '0'
  }, [getAuraChefNFTContract, callWithGasPrice, account])
  
  const withdrawReward = useCallback(async () => {
    const tx = await callWithGasPrice(getAuraChefNFTContract(), 'withdrawRewardToken', [])
    return tx.wait()
  }, [getAuraChefNFTContract, callWithGasPrice])

  return { 
    stakingNft,
    getPendingReward,
    withdrawReward,
  }
}
