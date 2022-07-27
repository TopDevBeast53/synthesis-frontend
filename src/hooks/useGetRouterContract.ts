import { useCallback } from "react";
import { Web3Provider } from '@ethersproject/providers'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import { AddressZero } from '@ethersproject/constants'
import { getProviderOrSigner, isAddress } from "utils";
import { ROUTER_ADDRESS } from '../config/constants'

import useProviders from './useProviders'

const useGetContract = () => {
    const rpcProvider = useProviders()
    return useCallback((address: string, ABI: any, signer?: ethers.Signer | ethers.providers.Provider): Contract => {
        if (!isAddress(address) || address === AddressZero) {
            throw Error(`Invalid 'address' parameter '${address}'.`)
        }

        return new Contract(address, ABI, signer ?? rpcProvider)
    }, [rpcProvider])
}

const useGetRouterContract = () => {
    const getContract = useGetContract()

    return useCallback((_: number, library: Web3Provider, account?: string) => {
        return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, getProviderOrSigner(library, account))
    }, [getContract])
}

export default useGetRouterContract;