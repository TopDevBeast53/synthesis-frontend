import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from 'uikit'
import { useMemo } from 'react'
import useGetChainDetail from 'hooks/useGetChainDetail'

const useWalletConnect = () => {
    const chain = useGetChainDetail()
    const walletconnect = useMemo((): WalletConnectConnector => {
        return new WalletConnectConnector({
            rpc: { [chain.chainId]: chain.rpcUrls[0] },
            qrcode: true,
            // pollingInterval: POLLING_INTERVAL,
        })
    }, [chain]);

    const injected = useMemo((): InjectedConnector => {
        return new InjectedConnector({ supportedChainIds: [chain.chainId] })
    }, [chain])

    const bscConnector = useMemo((): BscConnector => {
        return new BscConnector({ supportedChainIds: [chain.chainId] })
    }, [chain])

    const connectorsByName = useMemo((): { [connectorName in ConnectorNames]: any } => {
        return {
            [ConnectorNames.Injected]: injected,
            [ConnectorNames.WalletConnect]: walletconnect,
            [ConnectorNames.BSC]: bscConnector,
        }
    }, [bscConnector, injected, walletconnect])

    return connectorsByName
}

export default useWalletConnect