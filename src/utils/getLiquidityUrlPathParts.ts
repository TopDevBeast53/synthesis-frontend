// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import getTokens from 'config/constants/tokens'
import { ChainId, ETHER } from 'sdk'

const getLiquidityUrlPathParts = ({
    chainId,
    quoteTokenAddress,
    tokenAddress,
}: {
    chainId: ChainId,
    quoteTokenAddress: string
    tokenAddress: string
}): string => {
    const wEthAddress = getTokens(chainId).weth.address
    const firstPart = !quoteTokenAddress || quoteTokenAddress === wEthAddress ? ETHER[chainId].symbol : quoteTokenAddress
    const secondPart = !tokenAddress || tokenAddress === wEthAddress ? ETHER[chainId].symbol : tokenAddress
    return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
