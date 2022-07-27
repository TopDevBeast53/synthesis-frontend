import { useMulticallv2 } from 'hooks/useMulticall'
import yieldSwapABI from 'config/abi/HelixYieldSwap.json'
import { yieldSwapAddress } from '../constants'

export const useYieldSwap = () => {
    const multicallv2 = useMulticallv2()

    const fetchSwapData = async (): Promise<any[]> => {
        const swapCalls = [{
            address: yieldSwapAddress,
            name: 'getSwaps'
        }]
        const swapMulticallResult = await multicallv2(yieldSwapABI, swapCalls)
        return swapMulticallResult[0][0]
    }

    const fetchBids = async (bids) => {
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
