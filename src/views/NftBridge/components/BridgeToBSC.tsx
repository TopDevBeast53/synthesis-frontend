import React, { useState, useCallback, ChangeEvent } from 'react'
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Flex, Input, Button } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'

export default function BridgeToBSC() {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const [externalTokenId, setExternalTokenId] = useState('')
  const [tokenURI, setTokenURI] = useState('https://arweave.net/2d6UP97WSyZuj0vmVddaoFVR7d-LPwggBr1Ya-v49HU')
  const [loading, setLoading] = useState(false)

  const { bridgeFromSolana, mintBridgedNFT } = useAuraNFTBridge()

  const handleBridgeFromSolana = useCallback(async () => {
    try {
      setLoading(true)
      const receipt = await bridgeFromSolana(externalTokenId, tokenURI)
      if (receipt.status) {
        toastSuccess(t('Success'), t('Bridged From Solana!'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [bridgeFromSolana, externalTokenId, tokenURI, toastSuccess, toastError, t])

  const handleClaim = useCallback(async () => {
    try {
      setLoading(true)
      const receipt = await mintBridgedNFT(externalTokenId)
      if (receipt.status) {
        toastSuccess(t('Success'), t('Claim!'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [mintBridgedNFT, externalTokenId, toastSuccess, toastError, t])
  
  return (
    <Flex position="relative" padding="24px" flexDirection="column">
      <WalletModalProvider>
        <Flex position="relative" py="5px">
          <WalletMultiButton />
          <Flex padding="10px" />
          <WalletDisconnectButton />
        </Flex>   
      </WalletModalProvider>
      <Input
        placeholder='External Token ID'
        value={externalTokenId}
        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setExternalTokenId(evt.target.value)}
        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
      />
      <Input
        placeholder='Token URI'
        value={tokenURI}
        onChange={ (evt: ChangeEvent<HTMLInputElement>) => setTokenURI(evt.target.value)}
        style={{ position: 'relative', zIndex: 16, paddingRight: '40px', marginBottom: '16px'}}
      />
      <Button onClick={handleBridgeFromSolana} disabled={loading || externalTokenId.trim() === "" || tokenURI.trim() === ""} style={{ marginBottom: '10px' }}>
        BridgeFromSolana
      </Button>
      <Button onClick={handleClaim} disabled={loading || externalTokenId.trim() === ""} style={{ marginBottom: '10px' }}>
        Claim
      </Button>
    </Flex>
  )
}
