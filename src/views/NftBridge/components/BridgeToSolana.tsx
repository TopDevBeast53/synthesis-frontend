import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Heading, Text, useModal } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import CircleLoader from '../../../components/Loader/CircleLoader'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'
import NftCard from '../../NftStaking/components/NftCard'
import BridgeToSolanaModal from './BridgeToSolanaModal'


export default function BridgeToSolana({switcher}: {switcher: React.ReactNode}) {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const [tokens, setTokens] = useState([])
  const [selectedTokenID, setSelectedTokenID] = useState('')

  const [loading, setLoading] = useState(true)

  const { getUnstakedNftsFromBSC, approveToBridgeContract } = useAuraNFTBridge()

  const [onPresentBridgeModal] = useModal(
    <BridgeToSolanaModal tokenIDToBridge={selectedTokenID} />
  );

  const requestBridgeDestinationForToken = useCallback((tokenID: string) => {
    setSelectedTokenID(tokenID);
    onPresentBridgeModal();
  }, [setSelectedTokenID, onPresentBridgeModal]);

  const handleGetTokens = useCallback(() => {
    try {
      setLoading(true)
      getUnstakedNftsFromBSC().then((res) => {
        setTokens(res)
        setLoading(false)
      })
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
      setLoading(false)
    }
  }, [getUnstakedNftsFromBSC, toastError, t])
  
  useEffect(() => {
    handleGetTokens();
  }, [handleGetTokens])
  
  const handleApprove = useCallback(async (tokenId:string) => {
    try {
      setLoading(true)
      const receipt = await approveToBridgeContract(tokenId)
      if (receipt.status) {
        toastSuccess(t('Success'), t('Approved!'))
        const updatedTokens = tokens.map((token:any)=>{
          if (token.tokenId.toString() === tokenId.toString())
            return {...token, ...{isApproved: true}}
          return token
        })
        setTokens(updatedTokens)
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [approveToBridgeContract, tokens, toastSuccess, toastError, t])

  const TokensList = () => (
    <div>
      <Flex flexWrap="wrap" style={{margin: '-19px'}}>
        {tokens.map((token) => {
          return (
            <NftCard
              key={token.tokenId}
              bgSrc={token.uri}
              tokenId={token.tokenId}
              level={token.level}
              auraPoints={token.auraPoints}
              enableBoost={false}
              disabled={token.disabled}
              remainAPToNextLevel={token.remainAPToNextLevel}

              enableBridgeApprove={!token.isApproved}
              enableBridgeMutation={token.isApproved}
              onHandleBridgeApprove={handleApprove}
              onHandleBridgeMutation={requestBridgeDestinationForToken}
            >
              <Flex alignItems="center">
                <Text fontSize="12px" color="textSubtle">
                  AuraToken
                </Text>
              </Flex>
            </NftCard>
          )
        })}
      </Flex>
    </div>
  )

  return (
    <>
      <Flex justifyContent="space-between">
        <Heading as="h2" mt="20px" mb="10px">
          My NFTs on Binance
        </Heading>
        {switcher}
      </Flex>
      <Flex position="relative" padding="24px" flexDirection="column">
        {
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
          : (tokens.length > 0? <TokensList /> : "No NFTs found")}
      </Flex>
    </>
  )
}
