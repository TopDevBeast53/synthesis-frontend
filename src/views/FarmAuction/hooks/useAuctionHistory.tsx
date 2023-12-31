import { useState, useEffect } from 'react'
import { useFarmAuctionContract } from 'hooks/useContract'
import { Auction, Bidder } from 'config/constants/types'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import useProcessAuctionData from 'hooks/useProcessAuctionData'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { sortAuctionBidders } from '../helpers'

interface AuctionHistoryMap {
  [key: number]: {
    auction: Auction
    bidders: Bidder[]
  }
}

const useAuctionHistory = (auctionId: number) => {
  const [auctionHistory, setAuctionHistory] = useState<AuctionHistoryMap>({})

  const farmAuctionContract = useFarmAuctionContract()
  const processAuctionData = useProcessAuctionData()
  const { chainId } = useActiveWeb3React()

  // Get past auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const auctionData = await farmAuctionContract.auctions(auctionId)
        const processedAuctionData = await processAuctionData(auctionId, auctionData)

        const [auctionBidders] = await farmAuctionContract.viewBidsPerAuction(auctionId, 0, AUCTION_BIDDERS_TO_FETCH)
        const sortedBidders = sortAuctionBidders(chainId, auctionBidders, processedAuctionData)
        setAuctionHistory((prev) => ({
          ...prev,
          [auctionId]: { auction: processedAuctionData, bidders: sortedBidders },
        }))
      } catch (error) {
        console.error('Failed to fetch auction history', error)
      }
    }
    if (!auctionHistory[auctionId] && auctionId > 0) {
      fetchAuction()
    }
  }, [farmAuctionContract, auctionHistory, auctionId, processAuctionData, chainId])

  return auctionHistory
}

export default useAuctionHistory
