import React, { useState, useCallback } from 'react'
import orderBy from 'lodash/orderBy'
import { Flex, Button, Card, Text, Grid } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'
import { useGetTokensOfOwner, useGetTokenIdsOfOwner } from './hooks/useGetAuraNftInfo'
import { useStakingNft, useUnstakingNft } from './hooks/useStakingNft'
import NftCard from './components/NftCard'
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
  const { toastError, toastSuccess } = useToast()
  const [holdTokenIds, setHoldTokenIds] = useState([])
  const [tokens, setTokens] = useState([])
  const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([])
  const [requestedAuraNftIDs, setRequestedAuraNftIDs] = useState(false)
  const [requestedStaking, setRequestedStaking] = useState(true)

  const { onGetTokenIdsOfOwner } = useGetTokenIdsOfOwner()
  const { onGetTokensOfOwner } = useGetTokensOfOwner(holdTokenIds)
  const { onStakingNft } = useStakingNft(selectedTokenIds)
  const { onUnstakingNft } = useUnstakingNft(selectedTokenIds)
  
  const orderedNftById = orderBy(tokens, (token) => (token ? parseInt(token.tokenId.toString()) : 0), 'asc')

  const handleAuraNftIDs = useCallback(async () => {
    try {
      setRequestedAuraNftIDs(true)
      const res = await onGetTokenIdsOfOwner()
      setHoldTokenIds(res)
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setRequestedAuraNftIDs(false)
    }
  }, [onGetTokenIdsOfOwner, toastError, t])

  const handleAuraNfTokens = useCallback(async () => {
    try {
      setRequestedAuraNftIDs(true)
      const res = await onGetTokensOfOwner()
      setTokens(res)
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setRequestedAuraNftIDs(false)
    }
  }, [onGetTokensOfOwner, toastError, t])

  function checkValidSelectedTokens(isStaking:boolean) {
    if (selectedTokenIds.length === 0)
      return false
    for (let i = 0; i < selectedTokenIds.length; i++) {
      const id = selectedTokenIds[i].toString()
      const _tokens = tokens.filter((e) => (e.tokenId.toString() === id))
      if ((isStaking && _tokens[0].isStaked) || (!isStaking && !_tokens[0].isStaked))
        return false
    }
    return true
  }

  async function handleStaking(isStaking:boolean) {
    if (!checkValidSelectedTokens(isStaking)) {
      toastError(t('Error'), t('Please valid CheckBox.'))
      return
    }
    try {
      setRequestedStaking(true)
      if (isStaking) {
        await onStakingNft()
        toastSuccess(t('Success'), t('Staked!'))
      } else {
        await onUnstakingNft()
        toastSuccess(t('Success'), t('Unstaked!'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setRequestedStaking(false)
      setTokens([])
      handleAuraNfTokens()
    }
  }

  const onhandleCheckbox = useCallback((tokenId, isChecked) => {
    const _tokens = tokens.filter((e) => (e.tokenId.toString() === tokenId.toString()))
    if (_tokens.length > 0) {
      let _selIds
      if (isChecked) {
        _selIds = selectedTokenIds.concat(tokenId)
      } else {
        _selIds = selectedTokenIds.filter((e)=>(e !== tokenId))
      }
      setSelectedTokenIds(_selIds)
      setRequestedStaking(false)
    }
  }, [tokens, selectedTokenIds])

  return (
    <Page>
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <Button onClick={handleAuraNftIDs} disabled={requestedAuraNftIDs} style={{ marginBottom: '16px' }}>
            Please Get Owned NFT IDs
          </Button>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold mb="8px" ml="4px">
            {holdTokenIds.map((e)=> {return (<Text display="inline" paddingRight="10px">{e.id}</Text>)})}
          </Text>
          <Button onClick={handleAuraNfTokens} disabled={requestedAuraNftIDs} style={{ marginBottom: '16px' }}>
            Show My NFTs
          </Button>
        </Flex>
        <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
          {orderedNftById.map((token) => {
            return (
              <NftCard
                bgSrc="https://uyxpevlntmux.usemoralis.com:2053/server/files/KYoDoH8y6hy28lUBNtmo6WEimx85bBnNHdz2WnDj/5dc6161d4ae2a344a502dfa509c4004e_perso.png"
                tokenId={token.tokenId}
                isStaked={token.isStaked}
                level={token.level}
                tokenOwner={token.tokenOwner}
                onhandleChangeCheckBox={onhandleCheckbox}
              >
                <Flex alignItems="center">
                  <Text fontSize="12px" color="textSubtle">
                    AuraToken
                  </Text>
                </Flex>
              </NftCard>
            )
          })}
        </Grid>
        <Flex position="relative" padding="24px" flexDirection="column">
          <Button onClick={()=>handleStaking(true)} disabled={requestedStaking} style={{ marginBottom: '16px' }}>
              Staking
          </Button>
          <Button onClick={()=>handleStaking(false)} disabled={requestedStaking} style={{ marginBottom: '16px' }}>
              Unstaking
          </Button>
        </Flex>
      </AppBody>
    </Page>
  )
}
