// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import tokens from 'config/constants/tokens'

const getLiquidityUrlPathParts = ({
    quoteTokenAddress,
    tokenAddress,
}: {
    quoteTokenAddress: string
    tokenAddress: string
}): string => {
    const wEthAddress = tokens.weth.address
    const firstPart = !quoteTokenAddress || quoteTokenAddress === wEthAddress ? 'ETH' : quoteTokenAddress
    const secondPart = !tokenAddress || tokenAddress === wEthAddress ? 'ETH' : tokenAddress
    return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
