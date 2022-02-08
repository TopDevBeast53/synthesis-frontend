import React, { useState, useCallback } from 'react'
import { Flex, Button, Card, Text, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'
import { useGetAuraNftInfo } from './hooks/useGetAuraNftInfo'

import Page from '../Page'


const BodyWrapper = styled(Card)`
  border-radius: 25px;
  max-width: 800px;
  width: 100%;
  height: fit-content;
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

export default function NftStaking() {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const [lastTokenId, setLastTokenId] = useState('')
  const [requestedAuraNftInfo, setRequestedAuraNftInfo] = useState(false)

  const { onAuraNftInfo } = useGetAuraNftInfo()

  const handleAuraNftInfo = useCallback(async () => {
    try {
      setRequestedAuraNftInfo(true)
      const res = await onAuraNftInfo()
      setLastTokenId(res)
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setRequestedAuraNftInfo(false)
    }
  }, [onAuraNftInfo, toastError, t])

  return (
    <Page>
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <Heading as="h2" mb="14px">
            NFT Staking API
          </Heading>

          <Button onClick={handleAuraNftInfo}  disabled={requestedAuraNftInfo} style={{ marginBottom: '16px' }}>
            Last Token Id
          </Button>

          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
            LastTokenID : {lastTokenId}
          </Text>
        </Flex>
      </AppBody>
    </Page>
  )
}
