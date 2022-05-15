import { multicallv2 } from 'utils/multicall'
import lpSwapABI from 'config/abi/HelixLpSwap.json'
import { lpSwapAddress } from '../constants'

export const useLpSwap = () => {
  
    const fetchSwapData = async (): Promise<any[]> => {
        const swapCalls = [{
            address: lpSwapAddress,
            name: 'getSwaps'
        }]
        const swapMulticallResult = await multicallv2(lpSwapABI, swapCalls)
        return swapMulticallResult[0][0]
    }

    return {
        fetchSwapData,
    }
}
