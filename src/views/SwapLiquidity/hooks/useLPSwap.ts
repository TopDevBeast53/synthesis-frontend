import lpSwapABI from 'config/abi/HelixLpSwap.json'
import { useMulticallv2 } from 'hooks/useMulticall'
import { getHelixLPSwapAddress } from 'utils/addressHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export const useLpSwap = () => {
    const { chainId } = useActiveWeb3React()
    const multicallv2 = useMulticallv2()
    const fetchSwapData = async (): Promise<any[]> => {
        const swapCalls = [{
            address: getHelixLPSwapAddress(chainId),
            name: 'getSwaps'
        }]
        const swapMulticallResult = await multicallv2(lpSwapABI, swapCalls)
        return swapMulticallResult[0][0]
    }

    return {
        fetchSwapData,
    }
}
