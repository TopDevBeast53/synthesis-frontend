import React, { useState } from 'react'
import { Flex, ButtonMenu, ButtonMenuItem, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import PageHeader from 'components/PageHeader'
import BridgeToBSC from './components/BridgeToBSC'
import BridgeToSolana from './components/BridgeToSolana'
import Page from '../Page'

const NFTDisplayPanel = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 32px;
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

export default function NftBridge() {
  const { t } = useTranslation()
  const [viewPageIndex, setViewPageIndex] = useState(0)

  const onhandleItemClick = (newIndex: number) => {
    if (viewPageIndex === newIndex) return
    setViewPageIndex(newIndex)
  }

  const stakedOrUnstakedSwitch = (
    <Wrapper>
      <ButtonMenu activeIndex={viewPageIndex} onItemClick={onhandleItemClick} scale="sm" variant="subtle">
        <ButtonMenuItem>{t('Bridge To Solana')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Bridge To Ethereum')}</ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )

  return (
    <>
      <PageHeader background="transparent">
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Geobot Bridge')}
        </Heading>
      </PageHeader>
      <Page>
        <NFTDisplayPanel>
          {viewPageIndex === 0 ? (
            <BridgeToSolana switcher={stakedOrUnstakedSwitch} />
          ) : (
            <BridgeToBSC switcher={stakedOrUnstakedSwitch} />
          )}
        </NFTDisplayPanel>
      </Page>
    </>
  )
}
