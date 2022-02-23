import React, { useState, useCallback, useEffect } from 'react'
import filter from 'lodash/filter'
import { Flex, Heading, Button, Card, Text, Grid, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'
import { useGetAuraNftInfo } from './hooks/useGetAuraNftInfo'
import CircleLoader from '../../components/Loader/CircleLoader'
import NftCard from './components/NftCard'
import { useStakingNft } from './hooks/useStakingNft'
import { useBoostNft } from './hooks/useBoostNft'
import Page from '../Page'

const BodyWrapper = styled(Card)`
  border-radius: 25px;
  max-width: 800px;
  width: 100%;
  height: fit-content;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

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
        setLoading(false)
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
        setLoading(false)
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
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
        setLoadingPendingReward(false)
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
        setLoadingPendingReward(false)
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
      setLoadingPendingReward(false)
    }
  }, [getPendingReward, withdrawReward, toastSuccess, toastError, t])

  const handleBoost = useCallback(async (tokenId) => {
    try {
      setLoading(true)
      const receipt = await boostAuraNFT(tokenId, accumulatedAP)
      if (receipt.status){
        const _upgradedToken = await getAuraNftInfoById(tokenId)
        const _accumulatedAP = await getAccumulatedAP()
        toastSuccess(t('Success'), t('Boosted!'))
        const _tokens = tokens
        const updatedTokens = _tokens.map((token:any)=>{
          let _t = token
          if (token.tokenId.toString() === tokenId.toString())
            _t = {...token, ..._upgradedToken}
          return _t
        })
        setTokens(updatedTokens)
        setAccumulatedAP(_accumulatedAP)
        setLoading(false)
      } else {
        toastError(t('Error'), t('Error transaction Or Insufficient accumulated AuraPoints .'))
        setLoading(false)
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
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

  const stakedOrUnstakedSwitch = (
    <Wrapper>
      <ButtonMenu activeIndex={viewStaked? 0 : 1} onItemClick={onhandleItemClick} scale="sm" variant="subtle">
        <ButtonMenuItem>{t('Staked')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Unstaked')}</ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )

  return (
    <Page>
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <Heading as="h2" mb="14px">
            My NFTs 
          </Heading>
          <Text fontSize="14px" paddingBottom="15px">
            My Accumulated AuraPoints : {loadingAccumulatedAP ? "loading" : accumulatedAP}
          </Text>
          <Flex paddingBottom="18px">
            <Text fontSize="14px" paddingRight="15px">
              Pending Reward : {loadingPendingReward ? "loading" : pendingReward}
            </Text>
            <Button scale="sm" onClick={handleWithdraw}>
                Withdraw
            </Button>
          </Flex>
          <Flex justifyContent="center" padding="12px">
            {stakedOrUnstakedSwitch}
          </Flex>
          {loading && (
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
          )}
          {!loading && (
            <Grid padding="0px 8px" gridGap="10px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="24px">
              {filterNft.map((token) => {
                return (
                  <NftCard
                    key={token.tokenId}
                    bgSrc="https://uyxpevlntmux.usemoralis.com:2053/server/files/KYoDoH8y6hy28lUBNtmo6WEimx85bBnNHdz2WnDj/5dc6161d4ae2a344a502dfa509c4004e_perso.png"
                    tokenId={token.tokenId}
                    isStaked={token.isStaked}
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
            </Grid>
          )}
          {!loading && (
            <Button onClick={handleStaking} disabled={!enableStakingBtn} style={{ marginBottom: '10px' }}>
                {viewStaked? "Unstaking" : "Staking"}
            </Button>
          )}
        </Flex>
        
      </AppBody>
    </Page>
  )
}
