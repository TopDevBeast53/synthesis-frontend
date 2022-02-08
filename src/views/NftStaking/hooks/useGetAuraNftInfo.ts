import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getProviderOrSigner } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Contract } from '@ethersproject/contracts'

import auraNFTABI from 'config/abi/AuraNFT.json'
import { auraNFTAddress } from '../constants'

export const useGetAuraNftInfo = () => {
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleLastTokenId = useCallback(async () => {
    const contract = new Contract(auraNFTAddress, auraNFTABI, getProviderOrSigner(library, account))
    const tx = await callWithGasPrice(contract, 'getLastTokenId', [])
    return tx.toString();
  }, [callWithGasPrice, library, account])

  return { onAuraNftInfo: handleLastTokenId }
}

