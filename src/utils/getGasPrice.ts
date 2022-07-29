import { SUPPORTED_NETWORKS } from 'config/constants/networks'
import { ethers } from 'ethers'
import { ChainId } from 'sdk'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = async (chainId: ChainId) => {
    const network = SUPPORTED_NETWORKS[chainId]
    if (network.apiKey) {
        const provider = new ethers.providers.AlchemyProvider(chainId, network.apiKey)
        const gasPriceVal = await provider.getGasPrice()

        return gasPriceVal.toString()
    }

    const provider = new ethers.providers.StaticJsonRpcProvider(SUPPORTED_NETWORKS[chainId].rpcUrls[0])
    const gasPriceVal = await provider.getGasPrice()

    return gasPriceVal.toString()
}

export default getGasPrice
