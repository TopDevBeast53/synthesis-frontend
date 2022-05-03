import React, { useState } from 'react'
import { usePollFarmsWithUserData } from 'state/farms/hooks'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Heading } from 'uikit'
import YieldCParty from './YieldCParty'
import YieldParty from './YieldParty'

const Wrapper = styled.div`
  display: inline-block;
  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

export default function SwapYield() {
  const { t } = useTranslation()
  const [menuIndex, setMenuIndex] = useState(0)
  const handleButtonMenuClick = (newIndex) => {
    setMenuIndex(newIndex)
  }
  usePollFarmsWithUserData()
  return (
    <>
      <PageHeader background="transparent">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading as="h1" scale="xxl" color="secondary" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {t('Swap Yield')}
          </Heading>
          <Wrapper>
            <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
              <ButtonMenuItem>{t('Sell')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Buy')}</ButtonMenuItem>
            </ButtonMenu>
          </Wrapper>
        </div>
      </PageHeader>
      <>{menuIndex === 0 ? <YieldParty /> : menuIndex === 1 && <YieldCParty />}</>
    </>
  )
}
