import { AbstractConnector } from '@web3-react/abstract-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ethers } from 'ethers'

const POLLING_INTERVAL = 12000

export const getLibrary = (provider): ethers.providers.Web3Provider => {
    const library = new ethers.providers.Web3Provider(provider)
    library.pollingInterval = POLLING_INTERVAL
    return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
    connector: AbstractConnector,
    provider: any,
    account: string,
    message: string,
): Promise<string> => {
    if (window.BinanceChain && connector instanceof BscConnector) {
        const { signature } = await window.BinanceChain.bnbSign(account, message)
        return signature
    }

    /**
     * Wallet Connect does not sign the message correctly unless you use their method
     * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
     */
    if (provider.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
        const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
        return signature
    }

    return provider.getSigner(account).signMessage(message)
}
