import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import { filter } from 'lodash'
import { useHelixYieldSwap } from 'hooks/useContract'
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
    const yieldSwapContract = useHelixYieldSwap();

    const [menuIndex, setMenuIndex] = useState(SwapState.All)
    const [swaps, setSwaps] = useState([])
    const [filteredSwaps, setFilteredSwaps]=useState(filter(CPartySwapData, {state: menuIndex}))

    const handleButtonMenuClick = (newIndex) => {
        setFilteredSwaps(filter(CPartySwapData, {state: newIndex}))
        setMenuIndex(newIndex)
    }

    useEffect(() => {
        const fetchData = async () => {
            const ids = await yieldSwapContract.getSwapId()
            const swapIds = Array.from(Array(ids.toNumber()).keys())
            
            Promise.all(swapIds.map((i) => yieldSwapContract.swaps(i)))
            .then(res => {
                setSwaps(res)
            })
            .catch(err => {
                console.error(err)
            })
        }

        fetchData();
    })

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
                        {t('Pending')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Withdrawn')}
                    </ButtonMenuItem>
                </ButtonMenu>
            </Wrapper>
            <YieldCPartyTable swaps={filteredSwaps}/>
        </Page>
    )
}

export default YieldCParty