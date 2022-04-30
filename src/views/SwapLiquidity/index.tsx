import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Heading } from 'uikit'
import { SwapLiquidityContext } from './context'
import Sell from './Sell'
import Buy from './Buy'

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

export default function SwapLiquidity() {
  const { t } = useTranslation()  
  const [menuIndex,setMenuIndex] = useState(0)
  const [tableRefresh, setTableRefresh] = useState(0)
  const [filterState, setFilterState]=useState()    
  const context ={
    tableRefresh,  
    setTableRefresh, 
    filterState,
    setFilterState
}
  const handleButtonMenuClick = (newIndex) => {    
    setMenuIndex(newIndex)
  }
  return (
    <SwapLiquidityContext.Provider value={context}>
      <PageHeader background='transparent'> 
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <Heading as="h1" scale="xxl" color="secondary" style={{display:"inline-block", verticalAlign:"middle"}}>
            {t('Swap Yield')}  
          </Heading>
          <Wrapper>
            <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                <ButtonMenuItem>
                      {t('Sell')}
                  </ButtonMenuItem>
                  <ButtonMenuItem >
                      {t('Buy')}
                  </ButtonMenuItem>
              </ButtonMenu>
          </Wrapper>

        </div>
        
      </PageHeader>
      <>
        {
          (menuIndex === 0) ?  <Sell/> : menuIndex === 1 && <Buy/>
        }      
      </>
        
    </SwapLiquidityContext.Provider>
  )
}
