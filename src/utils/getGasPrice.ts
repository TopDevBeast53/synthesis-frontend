import { ethers } from 'ethers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = async (chainId: number) => {
    const provider = new ethers.providers.AlchemyProvider(chainId, process.env.REACT_APP_ALCHEMY_API_KEY)
    const gasPriceVal = await provider.getGasPrice()

    return gasPriceVal.toString()
}

export default getGasPrice
