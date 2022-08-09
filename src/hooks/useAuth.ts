import { useCallback } from 'react'
import { UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
    WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from 'uikit'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useClearUserStates from './useClearUserStates'
import useWalletConnect from './useWalletConnect'
import useActiveWeb3React from './useActiveWeb3React'

const useAuth = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { chainId, activate, deactivate, account } = useActiveWeb3React()
    const { toastError } = useToast()
    const connectorsByName = useWalletConnect()
    const clearUserStates = useClearUserStates()

    const login = useCallback(
        (connectorID: ConnectorNames) => {
            const connector = connectorsByName[connectorID]
            if (connector) {
                activate(connector, async (error: Error) => {
                    if (error instanceof UnsupportedChainIdError) {
                        if (!account) {
                            const hasSetup = await setupNetwork(chainId)
                            if (hasSetup) {
                                activate(connector)
                            }
                        }
                    } else {
                        window.localStorage.removeItem(connectorLocalStorageKey)
                        if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
                            toastError(t('Provider Error'), t('No provider was found'))
                        } else if (
                            error instanceof UserRejectedRequestErrorInjected ||
                            error instanceof UserRejectedRequestErrorWalletConnect
                        ) {
                            if (connector instanceof WalletConnectConnector) {
                                const walletConnector = connector as WalletConnectConnector
                                walletConnector.walletConnectProvider = null
                            }
                            toastError(t('Authorization Error'), t('Please authorize to access your account'))
                        } else {
                            toastError(error.name, error.message)
                        }
                    }
                })
            } else {
                toastError(t('Unable to find connector'), t('The connector config is wrong'))
            }
        },
        [connectorsByName, activate, account, chainId, toastError, t],
    )

    const logout = useCallback(() => {
        deactivate()
        clearUserStates(dispatch, chainId)
    }, [deactivate, dispatch, chainId, clearUserStates])

    return { login, logout }
}

export default useAuth
