import { add, differenceInHours, toDate } from 'date-fns'
import { BSC_BLOCK_TIME, DEFAULT_TOKEN_DECIMAL } from 'config'
import useProviders from 'hooks/useProviders'
import { AuctionsResponse, FarmAuctionContractStatus } from 'utils/types'
import { Auction, AuctionStatus } from 'config/constants/types'
import { ethersToBigNumber } from 'utils/bigNumber'
import { useCallback } from 'react'

// Determine if the auction is:
// - Live and biddable
// - Has been scheduled for specific future date
// - Not announced yet
// - Recently Finished/Closed
const getAuctionStatus = (
  currentBlock: number,
  startBlock: number,
  endBlock: number,
  contractStatus: FarmAuctionContractStatus,
) => {
  if (contractStatus === FarmAuctionContractStatus.Pending && !startBlock && !endBlock) {
    return AuctionStatus.ToBeAnnounced
  }
  if (contractStatus === FarmAuctionContractStatus.Close) {
    return AuctionStatus.Closed
  }
  if (currentBlock >= endBlock) {
    return AuctionStatus.Finished
  }
  if (contractStatus === FarmAuctionContractStatus.Open && currentBlock < startBlock) {
    return AuctionStatus.Pending
  }
  if (contractStatus === FarmAuctionContractStatus.Open && currentBlock > startBlock) {
    return AuctionStatus.Open
  }
  return AuctionStatus.ToBeAnnounced
}

const getDateForBlock = async (rpcProvider, currentBlock: number, block: number) => {
  const blocksUntilBlock = block - currentBlock
  const secondsUntilStart = blocksUntilBlock * BSC_BLOCK_TIME
  // if block already happened we can get timestamp via .getBlock(block)
  if (currentBlock > block) {
    try {
      const { timestamp } = await rpcProvider.getBlock(block)
      return toDate(timestamp * 1000)
    } catch {
      add(new Date(), { seconds: secondsUntilStart })
    }
  }
  return add(new Date(), { seconds: secondsUntilStart })
}

// Get additional auction information based on the date received from smart contract
const useProcessAuctionData = () => {
  const rpcProvider = useProviders()
  return useCallback(async (auctionId: number, auctionResponse: AuctionsResponse): Promise<Auction> => {
    const processedAuctionData = {
      ...auctionResponse,
      topLeaderboard: auctionResponse.leaderboard.toNumber(),
      initialBidAmount: ethersToBigNumber(auctionResponse.initialBidAmount).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
      leaderboardThreshold: ethersToBigNumber(auctionResponse.leaderboardThreshold),
      startBlock: auctionResponse.startBlock.toNumber(),
      endBlock: auctionResponse.endBlock.toNumber(),
    }

    const currentBlock = await rpcProvider.getBlockNumber()
    const startDate = await getDateForBlock(rpcProvider, currentBlock, processedAuctionData.startBlock)
    const endDate = await getDateForBlock(rpcProvider, currentBlock, processedAuctionData.endBlock)

    const auctionStatus = getAuctionStatus(
      currentBlock,
      processedAuctionData.startBlock,
      processedAuctionData.endBlock,
      processedAuctionData.status,
    )

    return {
      id: auctionId,
      startDate,
      endDate,
      auctionDuration: differenceInHours(endDate, startDate),
      ...processedAuctionData,
      status: auctionStatus,
    }
  }, [rpcProvider])
}

export default useProcessAuctionData