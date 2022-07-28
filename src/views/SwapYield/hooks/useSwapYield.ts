import { useMulticallv2 } from 'hooks/useMulticall'
import yieldSwapABI from 'config/abi/HelixYieldSwap.json'
import { getYieldSwapAddress } from 'utils/addressHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export const useYieldSwap = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()

    const fetchSwapData = async (): Promise<any[]> => {
        const swapCalls = [{
            address: getYieldSwapAddress(chainId),
            name: 'getSwaps'
        }]
        const swapMulticallResult = await multicallv2(yieldSwapABI, swapCalls)
        return swapMulticallResult[0][0]
    }

    const fetchBids = async (bids) => {
        const bidCalls = bids.map(bid => {
            return {
                address: getYieldSwapAddress(chainId),
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
