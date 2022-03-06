import React, { useState, useCallback, useEffect } from 'react'
import filter from 'lodash/filter'
import { Flex, Heading, Button, Card, Text, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'

import { CurrencyLogo } from 'components/Logo'
import unserializedTokens from 'config/constants/tokens'

import { NFTCardText, NFTCardTextType } from './components/NFTCardText'
import { useGetAuraNftInfo } from './hooks/useGetAuraNftInfo'
import CircleLoader from '../../components/Loader/CircleLoader'
import NftCard from './components/NftCard'
import { useStakingNft } from './hooks/useStakingNft'
import { useBoostNft } from './hooks/useBoostNft'
import Page from '../Page'
import { TokenInfo } from './type'
import NFTStartCollectPanel from './components/NFTStartCollectPanel'

const PageHeading = styled(Heading)`
  font-size: 70px;
  weight: 400;
  line-height: 73.5px;
  padding-bottom: 84px;
`;

const NFTDisplayPanel = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 70%;
  max-width: 1200px;
`;

const GeneralCard = styled(Card)`
  padding: 14px 29px 15px 29px;
  min-width: 288px;
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
  const [accumulatedAP, setAccumulatedAP] = useState('')
  const [pendingReward, setPendingReward] = useState('')
  const [viewStaked, setViewStaked] = useState(false)
  const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingAccumulatedAP, setLoadingAccumulatedAP] = useState(true)
  const [loadingPendingReward, setLoadingPendingReward] = useState(true)
  const [enableStakingBtn, setEnableStakingBtn] = useState(false)

  const { getTokens, getAuraNftInfoById } = useGetAuraNftInfo()
  const { stakingNft, getPendingReward, withdrawReward } = useStakingNft()
  const { getAccumulatedAP, boostAuraNFT } = useBoostNft()

  const filterNft = filter(tokens, (token:any) => (token.isStaked === viewStaked))
  
  const handleGetTokens = useCallback(() => {
    setLoading(true)
    getTokens().then((res) => {
      setTokens(res)
      setLoading(false)
    })
    
    setLoadingAccumulatedAP(true)
    getAccumulatedAP().then((res) => {
      setAccumulatedAP(res.toString())
      setLoadingAccumulatedAP(false)
    })

    setLoadingPendingReward(true)
    getPendingReward().then((res) => {
      setPendingReward(res.toString())
      setLoadingPendingReward(false)
    })
  }, [getTokens, getAccumulatedAP, getPendingReward])
  
  useEffect(() => {
    handleGetTokens();
  }, [handleGetTokens])

  const handleStaking = useCallback(async () => {
    try {
      setLoading(true)
      const receipt = await stakingNft(selectedTokenIds, !viewStaked)
      if (receipt.status){
        toastSuccess(t('Success'), t(!viewStaked ? 'Staked!' : 'Unstaked'))
        const _tokens = tokens
        const updatedTokens = _tokens.map((token:any)=>{
          let _t = token
          if (selectedTokenIds.indexOf(token.tokenId) >= 0){
            _t = {...token, ...{isStaked: !viewStaked}}
          }
          return _t
        })
        setTokens(updatedTokens)
        setSelectedTokenIds([])
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [stakingNft, viewStaked, tokens, selectedTokenIds, toastSuccess, toastError, t])

  const handleWithdraw = useCallback(async () => {
    try {
      setLoadingPendingReward(true)
      const receipt = await withdrawReward()
      if (receipt.status){
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
      const receipt = await boostAuraNFT(tokenId, accumulatedAP)
      if (receipt.status){
        const _upgradedToken: TokenInfo = await getAuraNftInfoById(tokenId)
        const _accumulatedAP = await getAccumulatedAP()
        toastSuccess(t('Success'), t('Boosted!'))
        const updatedTokens = tokens.map((token: TokenInfo)=>{
          if (token.tokenId.toString() === tokenId.toString())
            return {...token, ..._upgradedToken}
          return token
        })
        setTokens(updatedTokens)
        setAccumulatedAP(_accumulatedAP)
      } else {
        toastError(t('Error'), t('Error transaction Or Insufficient accumulated AuraPoints .'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [boostAuraNFT, getAccumulatedAP, getAuraNftInfoById, tokens, accumulatedAP, toastSuccess, toastError, t])
  
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
    if ((viewStaked? 0 : 1) === newIndex) return
    setViewStaked(newIndex === 0)
    setSelectedTokenIds([])
    setEnableStakingBtn(false)
  }

  const ShowStackedSwitch = () => (
    <Wrapper>
      <ButtonMenu activeIndex={viewStaked? 0 : 1} onItemClick={onhandleItemClick} scale="sm" variant="subtle">
        <ButtonMenuItem>{t('Staked')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Unstaked')}</ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
  
  const tokensUI = (
    <div>
      <Flex flexWrap="wrap" style={{margin: '-19px'}}>
        {filterNft.map((token) => {
          return (
            <NftCard
              key={token.tokenId}
              bgSrc="https://uyxpevlntmux.usemoralis.com:2053/server/files/KYoDoH8y6hy28lUBNtmo6WEimx85bBnNHdz2WnDj/5dc6161d4ae2a344a502dfa509c4004e_perso.png"
              tokenId={token.tokenId}
              level={token.level}
              auraPoints={token.auraPoints}
              enableBoost={parseInt(accumulatedAP)>0}
              disabled={token.disabled}
              remainAPToNextLevel={token.remainAPToNextLevel}
              onhandleChangeCheckBox={onhandleCheckbox}
              onhandleBoost={handleBoost}
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

  const auraToken = unserializedTokens.aura;

  return (
    <Page>
      <PageHeading> 
        My NFTs 
      </PageHeading>

      <NFTDisplayPanel>
        <Flex justifyContent="space-between">
          <Flex>
            <GeneralCard>
              <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
                My Accumulated Aura Points
              </NFTCardText>
              <Flex alignItems="center"> 
                <CurrencyLogo currency={auraToken} size="41px"/>
                <NFTCardText type={NFTCardTextType.generalValue} style={{paddingLeft: '18px'}}>
                  {loadingAccumulatedAP ? "loading" : accumulatedAP}
                </NFTCardText>
              </Flex>
            </GeneralCard>
            <GeneralCard style={{marginLeft: '25px'}}>
              <NFTCardText type={NFTCardTextType.generalCaption} style={{paddingBottom: '7px'}}>
                Pending Reward
              </NFTCardText>
              <Flex alignItems="center"> 
                <NFTCardText type={NFTCardTextType.generalValue}>
                  {loadingPendingReward ? "loading" : Number.parseFloat(pendingReward).toFixed(4)}
                </NFTCardText>
                <Button onClick={handleWithdraw} style={{marginLeft: '25px'}}>
                  Withdraw
                </Button>
              </Flex>
            </GeneralCard>
          </Flex>

          <Flex flexDirection="column" flexShrink={1}> 
            <ShowStackedSwitch />
            <NFTCardText type={NFTCardTextType.generalCaption} style={{marginTop: '10px'}}>
              Selected: {selectedTokenIds.length}
            </NFTCardText>
            <Button onClick={handleStaking} disabled={!enableStakingBtn} style={{ margin: '10px 0' }}>
              {viewStaked ? "Unstake" : "Stake"}
            </Button>
          </Flex>
        </Flex>

        <div style={{marginTop: '62px'}}>
          {loading ? (
            <Flex
              position="relative"
              height="300px"
              justifyContent="center"
              py="8px"
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
          ) : (
            tokens.length > 0 
              ? tokensUI 
              : <NFTStartCollectPanel />
            )
          }
        </div>
      </NFTDisplayPanel>
    </Page>
  )
}
