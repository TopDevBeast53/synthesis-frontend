import React, { useState } from 'react'
import { Flex, Card, ButtonMenu, ButtonMenuItem, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import WalletAdapter from './components/WalletAdapter'
import BridgeToBSC from './components/BridgeToBSC'
import BridgeToSolana from './components/BridgeToSolana'
import Page from '../Page'

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
        <ButtonMenuItem>{t('Bridge To BSC')}</ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )

  return (
    <Page>
      <PageHeading> 
        NFT Bridge 
      </PageHeading>
      <NFTDisplayPanel>
        <Flex flexDirection="row-reverse">
            {stakedOrUnstakedSwitch}
        </Flex>
        {viewPageIndex === 0 ? (<BridgeToSolana/>) : ( <WalletAdapter><BridgeToBSC/></WalletAdapter>)}
      </NFTDisplayPanel>
    </Page>
  )
}
