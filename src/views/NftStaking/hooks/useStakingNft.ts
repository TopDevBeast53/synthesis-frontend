import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
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
  
  return { 
    stakingNft
  }
}
