import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import filter from 'lodash/filter'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ButtonMenu, ButtonMenuItem, Card, Flex, Heading, Text, useMatchBreakpoints, Skeleton, useTooltip, HelpIcon } from 'uikit'
import { logError } from 'utils/sentry'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import NftCard from './components/NftCard'
import { NFTCardText, NFTCardTextType } from './components/NFTCardText'
import NFTStartCollectPanel from './components/NFTStartCollectPanel'
import { useGetNftInfo } from './hooks/useGetNftInfo'
import { useStakingNft } from './hooks/useStakingNft'

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
  padding: 15px 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 14px 29px 15px 29px;
  }
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

const ReferenceElement = styled.div`
  display: inline-block;
  margin-right: 1rem;
  vertical-align: text-top;
`
const Container = styled.div``

const ToolTipText = styled.div`
  display: inline-block;
  margin-right: 0.5rem;
  vertical-align: baseline;
`

export default function NftStaking() {
  const { account } = useActiveWeb3React()
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
  const { getTokens } = useGetNftInfo()
  const { stakingNft, getPendingReward, withdrawReward } = useStakingNft()
  const { isMobile } = useMatchBreakpoints()

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
                  type: "level",
                  caption: 'Wrapped NFTs',
                  value: (
                    <ToolTipCell toolTipText={token.nftNames.join()} tokenCounts={token.externalTokenIds.length} />
                  ),
                }
              ]}
              actions={[]}
              bgSrc={token.uri}
              disabled={token.disabled}
              onhandleChangeCheckBox={onhandleCheckbox}
              loading={loadingStatus}
              isSelected={selectedTokenIds?.includes(token.tokenId)}
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
        <Heading scale="lg" color="text" mt="3">
          Earn Yield by Staking Geobot NFTs
        </Heading>
      </PageHeader>
      {(!account) ?
        (<Page>
          <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>

            <Text fontSize="18px" bold>
              Connect Your Wallet...
            </Text>
          </Flex>
          <Flex justifyContent="center">
            <CircleLoader size="30px" />
          </Flex>
        </Page>) :
        (<Page removePadding>
          <NFTDisplayPanel>
            <Flex flexDirection={isMobile ? "column" : "row"} alignItems="center" justifyContent={isMobile ? "center" : "space-between"} flexWrap="wrap">
              <Flex flexWrap="wrap" alignItems="center">
                <GeneralCard>
                  <NFTCardText type={NFTCardTextType.generalCaption} style={{ paddingBottom: '7px' }}>
                    Pending Reward
                  </NFTCardText>
                  <Flex alignItems="center" flexWrap="wrap" justifyContent="space-between">
                    <NFTCardText type={NFTCardTextType.generalValue} style={{ marginRight: '25px' }}>
                      {loadingPendingReward ? <Skeleton width={120} height={30} /> : Number.parseFloat(pendingReward).toFixed(3)}
                    </NFTCardText>
                    <Button onClick={handleWithdraw} >
                      Withdraw
                    </Button>
                  </Flex>
                </GeneralCard>
              </Flex>

              <Flex flexDirection="column" justifyContent="start" flexShrink={1} style={{ marginTop: isMobile ? '32px' : '0px' }}>
                <ShowStackedSwitch />
                <Button
                  mt="15px"
                  isLoading={loadingStatus}
                  endIcon={loadingStatus ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={handleStaking}
                  disabled={!enableStakingBtn || selectedTokenIds.length === 0}
                >
                  {viewStaked ? `Unstake (${selectedTokenIds.length})` : `Stake (${selectedTokenIds.length})`}
                </Button>
              </Flex>
            </Flex>

            <div style={{ marginTop: isMobile ? '32px' : '62px' }}>
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
        </Page>)}
    </>
  )
}

function ToolTipCell({ toolTipText, tokenCounts }) {
  // eslint-disable-next-line react/destructuring-assignment
  const { targetRef, tooltip, tooltipVisible } = useTooltip(toolTipText, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      <ToolTipText>
        {tokenCounts}
      </ToolTipText>
      {tooltipVisible && tooltip}
    </Container>
  )
}

