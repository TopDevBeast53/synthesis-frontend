import React, { useState } from 'react'
import { Flex, Card, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import WalletAdapter from './components/WalletAdapter'
import BridgeToBSC from './components/BridgeToBSC'
import BridgeToSolana from './components/BridgeToSolana'
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
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <Flex justifyContent="center" padding="12px">
            {stakedOrUnstakedSwitch}
          </Flex>
          {viewPageIndex === 0 ? (<BridgeToSolana/>) : ( <WalletAdapter><BridgeToBSC/></WalletAdapter>)}
        </Flex>
      </AppBody>
    </Page>
  )
}
