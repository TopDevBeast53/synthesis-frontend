import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Heading, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { logError } from 'utils/sentry'
import CircleLoader from '../../../components/Loader/CircleLoader'
import { useNFTBridge } from '../hooks/useNFTBridge'
import NftCard from '../../NftStaking/components/NftCard'
import NFTStartCollectPanel from '../../NftStaking/components/NFTStartCollectPanel'

export default function BridgeToSolana({ switcher }: { switcher: React.ReactNode }) {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const [tokens, setTokens] = useState([])
  const [selectedTokenID, setSelectedTokenID] = useState('')

  const [loading, setLoading] = useState(true)

  const { getUnstakedNftsFromBSC, approveToBridgeContract } = useNFTBridge()

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
    handleGetTokens()
  }, [handleGetTokens])

  const handleApprove = useCallback(
    async (tokenId: string) => {
      try {
        setLoading(true)
        const receipt = await approveToBridgeContract(tokenId)
        if (receipt.status) {
          toastSuccess(t('Success'), t('Approved! Please click Brige To Solana button!'))
          const updatedTokens = tokens.map((token: any) => {
            if (token.tokenId.toString() === tokenId.toString()) return { ...token, ...{ isApproved: true } }
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
    },
    [approveToBridgeContract, tokens, toastSuccess, toastError, t],
  )

  const TokensList = () => (
    <div>
      <Flex flexWrap="wrap" style={{ margin: '-19px' }}>
        {tokens.map((token) => {
          return (
            <NftCard
              key={token.tokenId}
              tokenId={token.tokenId}
              infos={[
                {
                  caption: 'Level',
                  value: token.level,
                },
                {
                  caption: 'HelixPoints',
                  value: token.helixPoints,
                },
                {
                  caption: 'Remain APTo Next Level',
                  value: token.remainHPToNextLevel,
                },
              ]}
              actions={[
                {
                  id: 'bridge_approve',
                  caption: 'Approve',
                  displayed: !token.isApproved,
                  action: handleApprove,
                  params: [token.tokenId],
                },
                // {
                //   id: "bridge",
                //   caption: "Bridge to Solana",
                //   displayed: token.isApproved,
                //   action: requestBridgeDestinationForToken,
                //   params: [token.tokenId]
                // }
              ]}
              bgSrc={token.uri}
              disabled={token.disabled}
              showBridgeToSolanaModal={token.isApproved}
            />
          )
        })}
      </Flex>
    </div>
  )

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: '32px', minHeight: '60px' }}>
        <Heading as="h2" mt="20px" mb="10px">
          My Geobots on Binance
        </Heading>
        {switcher}
      </Flex>
      <Flex position="relative" flexDirection="column">
        {loading ? (
          <Flex position="relative" height="300px" justifyContent="center" py="4px">
            <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>
              <Text fontSize="18px" bold>
                Loading...
              </Text>
            </Flex>
            <Flex justifyContent="center">
              <CircleLoader size="30px" />
            </Flex>
          </Flex>
        ) : tokens.length > 0 ? (
          <TokensList />
        ) : (
          <NFTStartCollectPanel />
        )}
      </Flex>
    </>
  )
}
