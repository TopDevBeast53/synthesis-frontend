import React, { useState, useCallback, useMemo, CSSProperties, useEffect } from 'react'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from "@solana/wallet-adapter-react";
import { Flex, Card, IconButton, CopyIcon, Text } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import NftCard from '../../NftStaking/components/NftCard'
import WalletAdapter from './WalletAdapter'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'
import { NFTCardText, NFTCardTextType } from '../../NftStaking/components/NFTCardText'
import NFTConnectSolanaPanel from './NFTConnectSolanaPanel';
import 
{ 
  tokensToEnrichedNFTs, 
  approveNFT 
} from '../helper/utils';
import CircleLoader from '../../../components/Loader/CircleLoader'


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

export default function BridgeToBSC({switcher}: {switcher: React.ReactNode}) {
  return (
    <WalletAdapter>
      <BridgeToBSCInner switcher={switcher}/>
    </WalletAdapter>
  );
}

function BridgeToBSCInner({switcher}: {switcher: React.ReactNode}) {
  const wallet = useWallet();
  const { account } = useActiveWeb3React();
  const solanaAccountAddress = useMemo(() => wallet.publicKey?.toBase58(), [wallet.publicKey]);
  const solanaAccountAddressEllipsis = solanaAccountAddress 
    ? shortenAddress(solanaAccountAddress) 
    : null;

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false)

  // used for solana nft
  useEffect(() => {
    const getNFT = async () => {
      if(wallet.connected) {
        setLoading(true);
        getTokensInfo();
        setLoading(false);
      }
    }
    getNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected])

  // end of solana part

  const { bridgeToBSC, mintBridgedNFT, getMinted, isBridged } = useAuraNFTBridge()

  const updateTokensInfo = useCallback((tokens) => {
    return Promise.all(
      tokens.map(async (tk) => {
        const bridgeFlag = await isBridged(tk.mint.toString());
        const mintFlag = await getMinted(tk.mint.toString());
        return {...tk, isBridged: bridgeFlag, isMinted: Number(mintFlag) > 0}
      })
    )
  }, [isBridged, getMinted])

  const getTokensInfo = useCallback(async() => {
    const tokens = await tokensToEnrichedNFTs(wallet);
    const updatedTokens = await updateTokensInfo(tokens);
    setNFTs(updatedTokens);
  }, [updateTokensInfo, wallet])

  const handleApprove = useCallback(async (mint: string) => {
    try {
      if(!account) {
        toastError(t('Error'), t('Please check wallet connection.'))
        return;
      }
      setLoading(true)
      const res = await approveNFT(wallet, mint, account.slice(2));
      if (res) {
        toastSuccess(t('Success'), t('Bridged From Solana!'))
      }
      await getTokensInfo();
      setLoading(false);
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [getTokensInfo, toastSuccess, toastError, t, wallet, account])

  const handleBridge = useCallback(async (tokenID: string, uri: string) => {
    try {
      setLoading(true)
      const receipt = await bridgeToBSC(tokenID, uri)
      if (receipt.status) {
        toastSuccess(t('Success'), t('Bridged to bsc!'))
      }
      await getTokensInfo();
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [getTokensInfo, bridgeToBSC, toastSuccess, toastError, t])

  const handleClaim = useCallback(async (tokenID: string) => {
    try {
      setLoading(true)
      const receipt = await mintBridgedNFT(tokenID)
      if (receipt.status) {
        toastSuccess(t('Success'), t('Claim!'))
      }
      await getTokensInfo();
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [getTokensInfo, mintBridgedNFT, toastSuccess, toastError, t])

  const handleEmpty = () => {
    console.debug('finished!')
  }

  // const handleInitialize = async() => {
  //   await initializeStateAccount(wallet);
  // }

  const TokensList = () => (
    <div>
      <Flex flexWrap="wrap" style={{margin: '-19px'}}>
        {nfts.map((token) => {
          return (
            <NftCard
              key={token.address.toString()}
              tokenId={token.mint.toString()}
              name={token.metadataExternal?.name}
              mint={token.mint.toString()}
              infos={[
                {
                  caption: "Token ID",
                  value: 
                    <CopyValue value={token.mint.toString()}>
                      {shortenAddress(token.mint.toString(), 3)}
                    </CopyValue>
                  
                },
                {
                  caption: "URI",
                  value: 
                    <CopyValue value={
                        token.metadataExternal 
                        ? token.metadataExternal.image
                        : "https://arweave.net/vkk1RRYm9UsH7hIE92nBMcfYJBqBUwcYKh5zj__AjyA"
                      }
                    >
                     Image link
                    </CopyValue>
                }
              ]}
              actions={[
                {
                  id: "bridge_approve",
                  caption: "Approve",
                  displayed: !token.isApproved,
                  action: handleApprove,
                  params: [token.mint.toString()]
                },
                {
                  id: "bridge_to_bsc",
                  caption: "Bridge To BSC",
                  displayed: token.isApproved && !token.isBridged,
                  action: handleBridge,
                  params: [token.mint.toString(), getImage(token.metadataExternal)]
                },
                {
                  id: "bridge",
                  caption: "Claim",
                  displayed: token.isApproved && !token.isMinted,
                  action: handleClaim,
                  params: [token.mint.toString()]
                },
                {
                  id: "bridge",
                  caption: "Already Bridged!",
                  displayed: token.isBridged,
                  action: handleEmpty,
                  params: []
                },
              ]}
              bgSrc={token.metadataExternal ? token.metadataExternal.image: "https://arweave.net/vkk1RRYm9UsH7hIE92nBMcfYJBqBUwcYKh5zj__AjyA"}
              disabled={token.disabled}
            />
          )
        })}
      </Flex>
    </div>
  )
  
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" style={{marginBottom: '62px', minHeight: '140px'}}>
        <Flex>
          {wallet.connected && 
            <GeneralCard style={{ minWidth: "210px"}}>
              <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
                Solana wallet
              </NFTCardText>
              <Flex alignItems="center"> 
                <CopyValue value={solanaAccountAddress} style={{marginRight: '25px'}}>
                  <NFTCardText type={NFTCardTextType.cardValue}> 
                    {solanaAccountAddressEllipsis} 
                  </NFTCardText> 
                </CopyValue>
                <WalletDisconnectButton />
                {/* TODO: this button is just for admin and will be used just one time */}
                {/* <IconButton variant="text" onClick={handleInitialize} scale="xs" style={{marginLeft: "4px"}}>
                  <CopyIcon color="primary" width="24px" />
                </IconButton> */}
              </Flex>
            </GeneralCard>
          }
        </Flex>
        {switcher}
      </Flex>
      {
        !wallet.connected && 
        <NFTConnectSolanaPanel />
      }
      <Flex position="relative" flexDirection="column">
              
      { 
        wallet.connected && 
          loading 
          ? (
              <Flex
                position="relative"
                height="300px"
                justifyContent="center"
                py="4px"
              >
                <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>
                  <Text fontSize="18px" bold>
                    Loading...
                  </Text>
                </Flex>
                <Flex justifyContent="center">
                  <CircleLoader size="30px"/>
                </Flex>
              </Flex>
            )
          : (nfts.length > 0 ? <TokensList /> : null)
      }
      </Flex>
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
      <IconButton variant="text" onClick={copyValue} scale="xs" style={{marginLeft: "4px"}}>
        <CopyIcon color="primary" width="24px" />
      </IconButton>
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </Flex>
  )
}

function shortenAddress(address: string, trimLen = 4) {
  return `${address.substring(0, trimLen)}...${address.substring(address.length - (trimLen + 4))}` 
}

function getImage(metaData: any) {
  return metaData? metaData.image
  : "https://arweave.net/vkk1RRYm9UsH7hIE92nBMcfYJBqBUwcYKh5zj__AjyA";
}