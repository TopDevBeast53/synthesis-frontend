import { useEffect } from 'react'
import { useAppDispatch } from '../state'
import useClearUserStates from './useClearUserStates'
import useActiveWeb3React from './useActiveWeb3React'

export const useInactiveListener = () => {
    const { account, chainId, connector } = useActiveWeb3React()
    const dispatch = useAppDispatch()
    const clearUserStates = useClearUserStates()

    useEffect(() => {
        if (account && connector) {
            const handleDeactivate = () => {
                clearUserStates(dispatch, chainId)
            }

            connector.addListener('Web3ReactDeactivate', handleDeactivate)

            return () => {
                connector.removeListener('Web3ReactDeactivate', handleDeactivate)
            }
        }
        return undefined
    }, [account, chainId, dispatch, connector, clearUserStates])
}
