import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Heading, Text, Grid } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import CircleLoader from '../../../components/Loader/CircleLoader'
import AddressInputPanel from './AddressInputPanel'
import NftBridgeToSolanaCard from './NftBridgeToSolanaCard'
import { useAuraNFTBridge } from '../hooks/useAuraNFTBridge'


export default function BridgeToSolana() {
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

  const tokensGridUI = (
    <Grid gridGap="10px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="24px">
      {tokens.map((token) => {
        return (
          <NftBridgeToSolanaCard
            key={token.tokenId}
            bgSrc={token.uri}
            tokenId={token.tokenId}
            level={token.level}
            enableApproveBtn={!token.isApproved}
            enableBridgeBtn={token.isApproved && destination.length === 44}
            onhandleApprove={handleApprove}
            onhandleBridge={handleBridge}
          />
        )
      })}
    </Grid>
  )

  return (
    <Flex position="relative" padding="24px" flexDirection="column">
      <AddressInputPanel id="destination" value={destination} onChange={onChangeDestination} />
      <Heading as="h2" mt="20px" mb="10px">
        My NFTs on Binance
      </Heading>
      {loading ? (
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
      :
      (tokens.length>0?tokensGridUI : "No NFTs found")}
    </Flex>
  )
}
