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
            rpc: { [chain.CHAIN_ID]: chain.NODE_URL },
            qrcode: true,
            // pollingInterval: POLLING_INTERVAL,
        })
    }, [chain]);

    const injected = useMemo((): InjectedConnector => {
        return new InjectedConnector({ supportedChainIds: [chain.CHAIN_ID] })
    }, [chain])

    const bscConnector = useMemo((): BscConnector => {
        return new BscConnector({ supportedChainIds: [chain.CHAIN_ID] })
    }, [chain])

    const connectorsByName: { [connectorName in ConnectorNames]: any } = {
        [ConnectorNames.Injected]: injected,
        [ConnectorNames.WalletConnect]: walletconnect,
        [ConnectorNames.BSC]: bscConnector,
    }

    return connectorsByName
}

export default useWalletConnect