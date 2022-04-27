import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import { filter } from 'lodash'
import Page from 'components/Layout/Page'
import YieldCPartyTable from './components/YieldCParty/Table'
import { SwapState } from './types'
import { CPartySwapData } from './dummy'

const Wrapper = styled.div`
  display: flex;    
  align-items: center;
  justify-content:space-between;
  width:100%;
  a {
      padding-left: 12px;
      padding-right: 12px;
    }
    
    ${({ theme }) => theme.mediaQueries.sm} {
        margin-left: 16px;
  }
`

const YieldCParty = ()=>{
    const { t } = useTranslation()

    const [menuIndex, setMenuIndex] = useState(SwapState.All)
    const [filteredSwaps, setFilteredSwaps]=useState(filter(CPartySwapData, {state: menuIndex}))

    const handleButtonMenuClick = (newIndex) => {
        setFilteredSwaps(filter(CPartySwapData, {state: newIndex}))
        setMenuIndex(newIndex)
    }
    return (
        <Page>
            <Wrapper>
                <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                    <ButtonMenuItem>
                        {t('Orders')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Applied Orders')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Processing')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Finished')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Earned')}
                    </ButtonMenuItem>
                </ButtonMenu>
            </Wrapper>
            <YieldCPartyTable swaps={filteredSwaps}/>
        </Page>
    )
}

export default YieldCParty