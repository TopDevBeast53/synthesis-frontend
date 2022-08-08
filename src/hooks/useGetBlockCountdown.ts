import { useEffect, useRef, useState } from 'react'
import { BLOCK_TIME } from 'config'
import useProviders from 'hooks/useProviders'
import useActiveWeb3React from './useActiveWeb3React'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
    const timer = useRef<ReturnType<typeof setTimeout>>(null)
    const [secondsRemaining, setSecondsRemaining] = useState(0)
    const rpcProvider = useProviders()
    const { chainId } = useActiveWeb3React()

    useEffect(() => {
        const startCountdown = async () => {
            const currentBlock = await rpcProvider.getBlockNumber()

            if (blockNumber > currentBlock) {
                setSecondsRemaining((blockNumber - currentBlock) * BLOCK_TIME[chainId])

                // Clear previous interval
                if (timer.current) {
                    clearInterval(timer.current)
                }

                timer.current = setInterval(() => {
                    setSecondsRemaining((prevSecondsRemaining) => {
                        if (prevSecondsRemaining === 1) {
                            clearInterval(timer.current)
                        }

                        return prevSecondsRemaining - 1
                    })
                }, 1000)
            }
        }

        startCountdown()

        return () => {
            clearInterval(timer.current)
        }
    }, [setSecondsRemaining, blockNumber, timer, rpcProvider, chainId])

    return secondsRemaining
}

export default useBlockCountdown
