import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'
import auraChefNFTABI from 'config/abi/AuraChefNFT.json'

import { auraNFTChefAddress } from '../constants'


export const useStakingNft = (tokenIds:number[]) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleStakingNft = useCallback(async () => {
    const contract = new Contract(auraNFTChefAddress, auraChefNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'stake', [tokenIds])
    return tx.wait()
  }, [callWithGasPrice, tokenIds, library, account])
  return { onStakingNft: handleStakingNft }
}

export const useUnstakingNft = (tokenIds:number[]) => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleUnstakingNft = useCallback(async () => {
    const contract = new Contract(auraNFTChefAddress, auraChefNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'unstake', [tokenIds])
    return tx.wait()
  }, [callWithGasPrice, tokenIds, library, account])
  return { onUnstakingNft: handleUnstakingNft }
}