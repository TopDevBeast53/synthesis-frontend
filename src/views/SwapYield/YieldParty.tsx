import React, { useState } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ButtonMenu, ButtonMenuItem, Button, useModal } from 'uikit'
import Page from 'components/Layout/Page'
import YieldPartyTable from './components/YieldParty/Table'
import { PartyOrderData } from './dummy'
import { OrderState } from './types'
import AddRowModal from './components/YieldParty/CreateOrderDialog'
import CandidateDialog from  './components/YieldParty/CandidateTable'

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
const YieldParty = ()=>{
    const { t } = useTranslation()
    const [menuIndex,setMenuIndex] = useState(0)
    const [filterOrderState, setFilterOrderState]=useState(OrderState.Active)
    const [indexState, setIndexState] = useState(0)
    const handleButtonMenuClick = (newIndex) => {
        setFilterOrderState(newIndex)
        setMenuIndex(newIndex)
    }
    const [handleAdd] = useModal(<AddRowModal />)        
    const orderDatas=PartyOrderData    
    return (
        <Page>            
   
                <Wrapper>
                    <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                        <ButtonMenuItem>
                            {t('Active')}
                        </ButtonMenuItem>
                        <ButtonMenuItem >
                            {t('Earned')}
                        </ButtonMenuItem>
                    </ButtonMenu>
                    <Button variant="secondary" scale="md" mr="8px" onClick={handleAdd}> Add </Button>
                </Wrapper>
                <YieldPartyTable data={orderDatas} /> 
                            
        </Page>
    )
}

export default YieldParty