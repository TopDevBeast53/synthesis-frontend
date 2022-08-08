// Set of helper functions to facilitate wallet setup

import { BASE_URL } from 'config'
import { SUPPORTED_NETWORKS } from 'config/constants/networks'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId: number) => {
    const provider = window.ethereum
    const newChainId = `0x${chainId.toString(16)}`
    if (provider) {
        try {
            const curChainId: string = (await provider.request({ method: 'eth_chainId' })) as unknown as string;
            if (curChainId === newChainId) return true
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: newChainId,
                    },
                ],
            })
            return true
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: newChainId,
                                chainName: SUPPORTED_NETWORKS[chainId].chainNameForMetamask,
                                nativeCurrency: SUPPORTED_NETWORKS[chainId].nativeCurrency,
                                rpcUrls: SUPPORTED_NETWORKS[chainId].rpcUrlsForMetamask,
                                blockExplorerUrls: SUPPORTED_NETWORKS[chainId].blockExplorerUrls
                            },
                        ],
                    });
                    return true
                } catch (adderror) {
                    console.error('Failed to setup the network in Metamask:', adderror)
                    return false
                }
            } else {
                console.error('Failed to setup the network in Metamask:', error)
                return false
            }
        }
    } else {
        console.error("Can't setup the Network on metamask because window.ethereum is undefined")
        return false
    }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
    const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                image: `${BASE_URL}/images/tokens/${tokenAddress}.png`,
            },
        },
    })

    return tokenAdded
}
