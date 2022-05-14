import React, { useState, useCallback, useEffect } from 'react'
import filter from 'lodash/filter'
import { Flex, Heading, Button, Card, Text, ButtonMenu, ButtonMenuItem, AutoRenewIcon } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'

import { CurrencyLogo } from 'components/Logo'
import unserializedTokens from 'config/constants/tokens'
import PageHeader from 'components/PageHeader'
import { NFTCardText, NFTCardTextType } from './components/NFTCardText'
import { useGetNftInfo } from './hooks/useGetNftInfo'
import CircleLoader from '../../components/Loader/CircleLoader'
import NftCard from './components/NftCard'
import { useStakingNft } from './hooks/useStakingNft'
import { useBoostNft } from './hooks/useBoostNft'
import Page from '../Page'
import { TokenInfo } from './type'
import NFTStartCollectPanel from './components/NFTStartCollectPanel'

const NFTDisplayPanel = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 32px;
`

const GeneralCard = styled(Card)`
  padding: 14px 29px 15px 29px;
  min-width: 288px;
  margin-top: 1 rem;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }
`
export default function NftStaking() {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [tokens, setTokens] = useState([])
  const [accumulatedHP, setAccumulatedHP] = useState('')
  const [pendingReward, setPendingReward] = useState('')
  const [viewStaked, setViewStaked] = useState(false)
  const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingAccumulatedHP, setLoadingAccumulatedHP] = useState(true)
  const [loadingPendingReward, setLoadingPendingReward] = useState(true)
  const [enableStakingBtn, setEnableStakingBtn] = useState(false)

  const { getTokens, getHelixNftInfoById } = useGetNftInfo()
  const { stakingNft, getPendingReward, withdrawReward } = useStakingNft()
  const { getAccumulatedHP, boostHelixNFT } = useBoostNft()

  const filterNft = filter(tokens, (token: any) => token.isStaked === viewStaked)

  const handleGetTokens = useCallback(() => {
    setLoading(true)
    setLoadingAccumulatedHP(true)
    getAccumulatedHP().then((res) => {
      setAccumulatedHP(res.toString())
      setLoadingAccumulatedHP(false)
    })

    setLoadingPendingReward(true)
    getPendingReward().then((res) => {
      setPendingReward(res.toString())
      setLoadingPendingReward(false)
    })

    getTokens().then((res) => {
      setTokens(res)
      setLoading(false)
    })
  }, [getTokens, getAccumulatedHP, getPendingReward])

  useEffect(() => {
    handleGetTokens()
  }, [handleGetTokens])

  const handleStaking = useCallback(async () => {
    try {
      setLoading(true)
      const receipt = await stakingNft(selectedTokenIds, !viewStaked)
      if (receipt.status) {
        toastSuccess(t('Success'), t(!viewStaked ? 'Staked!' : 'Unstaked'))
        const _tokens = tokens
        const updatedTokens = _tokens.map((token: any) => {
          let _t = token
          if (selectedTokenIds.indexOf(token.tokenId) >= 0) {
            _t = { ...token, ...{ isStaked: !viewStaked } }
          }
          return _t
        })
        setTokens(updatedTokens)
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setSelectedTokenIds([])
      setLoading(false)
    }
  }, [stakingNft, viewStaked, tokens, selectedTokenIds, toastSuccess, toastError, t])

  const handleWithdraw = useCallback(async () => {
    try {
      setLoadingPendingReward(true)
      const receipt = await withdrawReward()
      if (receipt.status) {
        toastSuccess(t('Success'), t('Withdraw'))
        const res = await getPendingReward()
        setPendingReward(res.toString())
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoadingPendingReward(false)
    }
  }, [getPendingReward, withdrawReward, toastSuccess, toastError, t])

  const handleBoost = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      const receipt = await boostHelixNFT(tokenId, accumulatedHP)
      if (receipt.status){
        const _upgradedToken: TokenInfo = await getHelixNftInfoById(tokenId)
        const _accumulatedHP = await getAccumulatedHP()
        toastSuccess(t('Success'), t('Boosted!'))
        const updatedTokens = tokens.map((token: TokenInfo)=>{
          if (token.tokenId.toString() === tokenId.toString())
            return {...token, ..._upgradedToken}
          return token
        })
        setTokens(updatedTokens)
        setAccumulatedHP(_accumulatedHP)
      } else {
        toastError(t('Error'), t('Insufficient accumulated HelixPoints.'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Insufficient accumulated HelixPoints.'))
    } finally {
      setLoading(false)
    }
  }, [boostHelixNFT, getAccumulatedHP, getHelixNftInfoById, tokens, accumulatedHP, toastSuccess, toastError, t])
  
  const onhandleCheckbox = useCallback(
    (tokenId, isChecked) => {
      let _selIds
      if (isChecked) {
        _selIds = selectedTokenIds.concat(tokenId)
      } else {
        _selIds = selectedTokenIds.filter((e) => e !== tokenId)
      }
      setSelectedTokenIds(_selIds)
      setEnableStakingBtn(_selIds.length > 0)
    },
    [selectedTokenIds],
  )

  const onhandleItemClick = (newIndex: number) => {
    if ((viewStaked ? 0 : 1) === newIndex) return
    setViewStaked(newIndex === 0)
    setSelectedTokenIds([])
    setEnableStakingBtn(false)
  }

  const ShowStackedSwitch = () => (
    <Wrapper>
      <ButtonMenu activeIndex={viewStaked ? 0 : 1} onItemClick={onhandleItemClick} scale="sm" variant="subtle">
        <ButtonMenuItem>{t('Staked')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Unstaked')}</ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )

  const tokensUI = (
    <div>
      <Flex flexWrap="wrap" justifyContent="center" style={{ margin: '-19px' }}>
        {filterNft.map((token) => {
          return (
            <NftCard
              key={token.tokenId}
              tokenId={token.tokenId}
              infos={[
                {
                  type: "level",
                  caption: "Level",
                  value: token.level,
                },
                {
                  type: "points",
                  caption: "HelixPoints",
                  value: token.helixPoints,
                },
                {
                  type: "remainNextLevel",
                  caption: "Remain HP To Next Level",
                  value: token.remainHPToNextLevel,
                },
              ]}
              actions={[
                {
                  id: 'boost',
                  caption: 'Boost',
                  displayed: parseInt(accumulatedHP) > 0,
                  action: handleBoost,
                  params: [token.tokenId],
                },
              ]}
              bgSrc={token.uri}
              disabled={token.disabled}
              onhandleChangeCheckBox={onhandleCheckbox}
              loading={loadingStatus}
            />
          )
        })}
      </Flex>
    </div>
  )

  const helixToken = unserializedTokens.helix

  return (
    <>
      <PageHeader background="transparent">
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Stake Your Geobots')}
        </Heading>
      </PageHeader>
      <Page>
        <NFTDisplayPanel>
          <Flex justifyContent="space-between" flexWrap="wrap">
            <Flex flexWrap="wrap">
              <GeneralCard style={{marginTop: '15px'}}>
                <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
                  My Accumulated Helix Points
                </NFTCardText>
                <Flex alignItems="center">
                  <CurrencyLogo currency={helixToken} size="41px" />
                  <NFTCardText type={NFTCardTextType.generalValue} style={{ paddingLeft: '18px' }}>
                    {loadingAccumulatedHP ? 'loading' : Number.parseFloat(accumulatedHP).toFixed(3)}
                  </NFTCardText>
                </Flex>
              </GeneralCard>
              <GeneralCard style={{marginTop: '15px', marginLeft: '25px'}}>
                <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
                  Pending Reward
                </NFTCardText>
                <Flex alignItems="center" flexWrap="wrap"> 
                  <NFTCardText type={NFTCardTextType.generalValue}>
                    {loadingPendingReward ? 'loading' : Number.parseFloat(pendingReward).toFixed(3)}
                  </NFTCardText>
                  <Button onClick={handleWithdraw} style={{ marginLeft: '25px' }}>
                    Withdraw
                  </Button>
                </Flex>
              </GeneralCard>
            </Flex>

            <Flex flexDirection="column" justifyContent="space-between" flexShrink={1} style={{marginTop: '15px'}}> 
              <ShowStackedSwitch />
              <Button 
                isLoading={loadingStatus} 
                endIcon={loadingStatus ? <AutoRenewIcon spin color="currentColor" /> : null}  
                onClick={handleStaking} 
                disabled={!enableStakingBtn} 
                style={{ margin: '10px 0' }}>
                {viewStaked ? `Unstake (${selectedTokenIds.length})` : `Stake (${selectedTokenIds.length})` }
              </Button>
            </Flex>
          </Flex>

          <div style={{ marginTop: '62px' }}>
            {loading ? (
              <Flex position="relative" height="300px" justifyContent="center" py="8px">
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
              tokensUI
            ) : (
              <NFTStartCollectPanel />
            )}
          </div>
        </NFTDisplayPanel>
      </Page>
    </>
  )
}
