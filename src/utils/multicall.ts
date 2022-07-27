import { ethers } from 'ethers'
import { getMulticallContract } from 'utils/contractHelpers'

export interface Call {
    address: string // Address of the contract
    name: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
    const multi = getMulticallContract()
    const itf = new ethers.utils.Interface(abi)

    const calldata = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: itf.encodeFunctionData(call.name, call.params),
    }))
    const { returnData } = await multi.aggregate(calldata)
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res as any
}

export default multicall
