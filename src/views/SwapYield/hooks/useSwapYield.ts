import { multicallv2 } from 'utils/multicall'
import yieldSwapABI from 'config/abi/HelixYieldSwap.json'
import { yieldSwapAddress } from '../constants'

export const useYieldSwap = () => {
  
    const fetchSwapData = async (): Promise<any[]> => {
        const swapCalls = [{
            address: yieldSwapAddress,
            name: 'getSwaps'
        }]
        const swapMulticallResult = await multicallv2(yieldSwapABI, swapCalls)
        return swapMulticallResult[0][0]
    }

    const fetchBids = async(bids) => {
        const bidCalls = bids.map(bid => {
            return {
                address: yieldSwapAddress,
                name: 'bids',
                params: [bid]
            }
        })
        const bidMulticallResult = await multicallv2(yieldSwapABI, bidCalls)
        return bidMulticallResult
    }

    return {
        fetchSwapData,
        fetchBids
    }
}
