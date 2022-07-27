import lpSwapABI from 'config/abi/HelixLpSwap.json'
import { useMulticallv2 } from 'hooks/useMulticall'
import { lpSwapAddress } from '../constants'

export const useLpSwap = () => {
    const multicallv2 = useMulticallv2()
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
