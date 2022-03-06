import React, { useState, useCallback, ChangeEvent, useMemo, CSSProperties } from 'react'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from "@solana/wallet-adapter-react";
import { Flex, Input, Button, Card, IconButton, CopyIcon, Text, Heading } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import { AppBody } from 'components/App';   
import WalletAdapter from './WalletAdapter'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'
import { NFTCardText, NFTCardTextType } from '../../NftStaking/components/NFTCardText'

const GeneralCard = styled(Card)`
  padding: 14px 29px 15px 29px;
  min-width: 288px;
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  top: -28px;
  right: -20px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 4px;
  opacity: 0.7;
  width: 100px;
`

const HeaderContainer = styled(Flex)`
    align-items: center;
    padding: 24px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export default function BridgeToBSC({switcher}: {switcher: React.ReactNode}) {
  return (
    <WalletAdapter>
      <BridgeToBSCInner switcher={switcher}/>
    </WalletAdapter>
  );
}

function BridgeToBSCInner({switcher}: {switcher: React.ReactNode}) {
  const { connected: isSolanaWalletConnected, publicKey: rawAddress } = useWallet();
  const solanaAccountAddress = useMemo(() => rawAddress?.toBase58(), [rawAddress]);
  const solanaAccountAddressEllipsis = solanaAccountAddress 
    ? `${solanaAccountAddress.substring(0, 4)}...${solanaAccountAddress.substring(solanaAccountAddress.length - 8)}` 
    : null;

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
    <>
    <Flex justifyContent="space-between" style={{marginBottom: '62px'}}>
      <Flex>
        <GeneralCard style={{ minWidth: "210px"}}>
          <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
            Solana wallet
          </NFTCardText>
          <Flex alignItems="center"> 
            {
              isSolanaWalletConnected
              ? <> 
                  <CopyValue value={solanaAccountAddress} style={{marginRight: '25px'}}>
                    <NFTCardText type={NFTCardTextType.cardValue}> 
                      {solanaAccountAddressEllipsis} 
                    </NFTCardText> 
                  </CopyValue>
                  <WalletDisconnectButton /> 
                </>
              : <WalletMultiButton />
            }
          </Flex>
        </GeneralCard>
      </Flex>
      {switcher}
    </Flex>
            
    { 
      isSolanaWalletConnected && 
      <Flex justifyContent="center" alignItems="center">
        <AppBody>
          <Header 
            title="Bridge NFT from Solana"
            subtitle="Bridge NFT from you Solana wallet to Binance wallet"
          />
          <Flex position="relative" padding="24px" flexDirection="column">
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
            <Button 
              onClick={handleBridgeFromSolana} 
              disabled={loading || externalTokenId.trim() === "" || tokenURI.trim() === ""} 
              style={{ marginBottom: '16px' }}
            >
              {
                externalTokenId.trim() === "" 
                ? "Enter Token ID"
                : tokenURI.trim() === ""
                  ? "Enter Token URI"
                  : "Bridge"
              }
            </Button>
            <Button 
              onClick={handleClaim} 
              disabled={loading || externalTokenId.trim() === ""}
             >
              {
                tokenURI.trim() === ""
                ? "Enter Token URI"
                : "Claim"
              }
            </Button>
          </Flex>
        </AppBody>
      </Flex>
    }
    </>
  )
}

function CopyValue({ 
    value, 
    children, 
    style 
  } : { 
    value: string, 
    children: React.ReactNode, 
    style?: CSSProperties | undefined 
  }) {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 500)
  }

  const copyValue = () => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(value).then(() => displayTooltip())
    }
  }

  return (
    <Flex alignItems="center" position="relative" style={style}>
      {children}
      <IconButton variant="text" onClick={copyValue}>
        <CopyIcon color="primary" width="24px" />
      </IconButton>
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </Flex>
  )
}

function Header({ title, subtitle } : { title: string, subtitle: string }) {
    return (
        <HeaderContainer>
            <Flex width="100%" alignItems="flex-start" justifyContent="space-between" flexDirection="column">
                <Flex flexDirection="column" alignItems="center" alignSelf="center">
                    <Heading as="h2" mb="8px">
                        {title}
                    </Heading>
                    <Flex alignItems="center">
                        <Text color="textSubtle" fontSize="14px">
                        {subtitle}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </HeaderContainer>
    );
}