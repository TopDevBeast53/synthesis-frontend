import * as Sentry from '@sentry/react'
import { Dispatch } from '@reduxjs/toolkit'
import { connectorLocalStorageKey } from 'uikit'
// import { resetUserNftState } from '../state/nftMarket/reducer'
import useWalletConnect from 'hooks/useWalletConnect'
import { useCallback } from 'react'
import { clearAllTransactions } from '../state/transactions/actions'
import { profileClear } from '../state/profile'

const useClearUserStates = () => {
    const connectorsByName = useWalletConnect()

    return useCallback((dispatch: Dispatch<any>, chainId: number) => {
        dispatch(profileClear())
        // dispatch(resetUserNftState())
        Sentry.configureScope((scope) => scope.setUser(null))
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window.localStorage.getItem('walletconnect')) {
            connectorsByName.walletconnect.close()
            connectorsByName.walletconnect.walletConnectProvider = null
        }
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (chainId) {
            dispatch(clearAllTransactions({ chainId }))
        }
    }, [connectorsByName]);
}

export default useClearUserStates