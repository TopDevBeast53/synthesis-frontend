import { ChainId } from 'sdk'
import getTokens from './tokens'
// import getLpAddress from 'utils/getLpAddress'
import { FarmAuctionBidderConfig } from './types'

export const whitelistedBidders: FarmAuctionBidderConfig[] = [].map((bidderConfig) => ({
    ...bidderConfig,
    // lpAddress: getLpAddress(bidderConfig.tokenAddress, bidderConfig.quoteToken),
}))


export const getBidderInfo = (account: string, chainId: ChainId): FarmAuctionBidderConfig => {
    const tokens = getTokens(chainId)
    let quoteToken = tokens.weth
    if ([ChainId.RSK_MAINNET, ChainId.RSK_TESTNET].includes(chainId))
        quoteToken = tokens.weth

    const UNKNOWN_BIDDER: FarmAuctionBidderConfig = {
        account: '',
        tokenAddress: '',
        quoteToken,
        farmName: 'Unknown',
        tokenName: 'Unknown',
    }
    const matchingBidder = whitelistedBidders.find((bidder) => bidder.account.toLowerCase() === account.toLowerCase())
    if (matchingBidder) {
        return matchingBidder
    }
    return { ...UNKNOWN_BIDDER, account }
}
