import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Heading, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import CircleLoader from '../../../components/Loader/CircleLoader'
import AddressInputPanel from './AddressInputPanel'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'
import NftCard from '../../NftStaking/components/NftCard'


export default function BridgeToSolana({switcher}: {switcher: React.ReactNode}) {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const [tokens, setTokens] = useState([])
  const [destination, setDestination] = useState('')

  const [loading, setLoading] = useState(true)

  const { getUnstakedNftsFromBSC, approveToBridgeContract, bridgeToSolana } = useAuraNFTBridge()

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

  const handleBridge = useCallback(async (tokenId:string) => {
    try {
      setLoading(true)
      const receipt = await bridgeToSolana(tokenId, destination)
      if (receipt.status){
        toastSuccess(t('Success'), t('Bridged to solana!'))
        const _tokens = tokens.filter((e) => e.tokenId !== tokenId)
        setTokens(_tokens)
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [bridgeToSolana, tokens, destination, toastSuccess, toastError, t])

  const onChangeDestination = useCallback((value:string) => {
    setDestination(value)
  }, [])

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
              enableBridgeMutation={token.isApproved && destination.length === 44}
              onHandleBridgeApprove={handleApprove}
              onHandleBridgeMutation={handleBridge}
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
      <Flex flexDirection="row-reverse">
        {switcher}
      </Flex>
      <Flex position="relative" padding="24px" flexDirection="column">
        <AddressInputPanel id="destination" value={destination} onChange={onChangeDestination} />
        <Heading as="h2" mt="20px" mb="10px">
          My NFTs on Binance
        </Heading>
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
