import { ethers } from 'ethers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = async () => {
    const chainId = process.env.REACT_APP_CHAIN_ID
    const apiKey = process.env.REACT_APP_ALCHEMY_API_KEY
    const provider = new ethers.providers.AlchemyProvider(parseInt(chainId), apiKey)
    const gasPriceVal = await provider.getGasPrice()

    return gasPriceVal.toString()
}

export default getGasPrice
