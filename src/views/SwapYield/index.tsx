import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { usePollFarmsWithUserData } from 'state/farms/hooks'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Heading } from 'uikit'
import YieldCParty from './YieldCParty'
import YieldParty from './YieldParty'

const Wrapper = styled.div`  
  a {
    padding-left: 12px;
    padding-right: 12px;
  }
  div{
    flex-direction:column;
    margin-top:25px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;    
    display: inline-block;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    div{
      flex-direction:row;
    }      
  }
`
const FlexDiv = styled.div`

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content:space-between;
    align-items:center;
    display:flex;
  }
`

export default function SwapYield() {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [menuIndex, setMenuIndex] = useState(0)
  const handleButtonMenuClick = (newIndex) => {
    setMenuIndex(newIndex)
  }
  usePollFarmsWithUserData()
  return (
    <>
      <PageHeader background="transparent" style={{textAlign:"center"}}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
        <FlexDiv>
          <Heading as="h1" scale="xxl" color="secondary" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {t('Swap Yield')}
          </Heading>
          {
            account && (
              <Wrapper>
                <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                  <ButtonMenuItem>{t('Find Yield Swaps')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('My Yield Swaps')}</ButtonMenuItem>
                </ButtonMenu>
              </Wrapper>
            )
          }
        </FlexDiv>
      </PageHeader>
      <>{menuIndex === 0 ? <YieldCParty /> : menuIndex === 1 && <YieldParty />}</>
    </>
  )
}
