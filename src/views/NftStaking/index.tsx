import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import filter from 'lodash/filter'
import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ButtonMenu, ButtonMenuItem, Card, CopyIcon, Flex, Heading, IconButton, Text, useMatchBreakpoints } from 'uikit'
import { logError } from 'utils/sentry'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import NftCard from './components/NftCard'
import { NFTCardText, NFTCardTextType } from './components/NFTCardText'
import NFTStartCollectPanel from './components/NFTStartCollectPanel'
import { useGetNftInfo } from './hooks/useGetNftInfo'
import { useStakingNft } from './hooks/useStakingNft'

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

const StyledCopyIcon = styled(CopyIcon)`
  width: 14px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 18px;
  }
`


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
  const [pendingReward, setPendingReward] = useState('')
  const [viewStaked, setViewStaked] = useState(false)
  const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState(false)  
  const [loadingPendingReward, setLoadingPendingReward] = useState(true)
  const [enableStakingBtn, setEnableStakingBtn] = useState(false)
  const { getTokens} = useGetNftInfo()
  const { stakingNft, getPendingReward, withdrawReward } = useStakingNft()

  const filterNft = filter(tokens, (token: any) => token.isStaked === viewStaked)

  const handleGetTokens = useCallback(() => {
    setLoading(true)        

    setLoadingPendingReward(true)
    getPendingReward().then((res) => {
      setPendingReward(res.toString())
      setLoadingPendingReward(false)
    })    
    getTokens().then((res) => {
      setTokens(res)
      setLoading(false)
    })
  }, [getTokens, getPendingReward])

  useEffect(() => {
    handleGetTokens()
  }, [handleGetTokens])

  const handleStaking = useCallback(async () => {
    try {
      setLoadingStatus(true)
      
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
      setLoadingStatus(false)
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
                  type:"level",
                  caption: 'Wrapped NFTs',
                  value: (
                    <span>{token.wrappedNfts}</span>
                  ),
                }
              ]}
              actions={[]}
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
                disabled={!enableStakingBtn || selectedTokenIds.length === 0} 
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

