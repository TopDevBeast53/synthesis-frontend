import { useCallback, useMemo } from 'react'
import { ethers, Contract } from 'ethers'
import { useMasterchef } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveFarm = (lpContract: Contract) => {
    const overrides = useMemo(
        () => ({
            gasLimit: 9999999,
        }),
        [],
    )
    const masterChefContract = useMasterchef()
    const { callWithGasPrice } = useCallWithGasPrice()
    const handleApprove = useCallback(async () => {
        const tx = await callWithGasPrice(lpContract, 'approve', [
            masterChefContract.address,
            ethers.constants.MaxUint256,
        ], overrides)
        const receipt = await tx.wait()
        return receipt.status
    }, [lpContract, masterChefContract, callWithGasPrice, overrides])

    return { onApprove: handleApprove }
}

export default useApproveFarm
