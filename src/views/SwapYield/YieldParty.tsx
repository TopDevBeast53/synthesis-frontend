import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useModal } from 'uikit'
import { useFastFresh } from 'hooks/useRefresh'
import AddRowModal from './components/YieldParty/Modals/CreateOrderDialog'
import YieldPartyTable from './components/YieldParty/Table'
import { YieldPartyContext } from './context'
import { OrderState } from './types'

const Wrapper = styled.div`
  display: flex;    
  align-items: center;
  justify-content:space-between;
  width:100%;
  margin-bottom:1em;
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
    const { toastError } = useToast()
    const YieldSwapContract = useHelixYieldSwap()  
    const {account} = useWeb3React()
    const [menuIndex, setMenuIndex] = useState(0)
    // const [filterOrderState, setFilterOrderState]=useState(OrderState.Active)    
    const [swapIds, setSwapIds] = useState([])
    const [refresh,setTableRefresh] = useState(0)
    const [orderState, setOrderState] = useState(OrderState.Active)
    const fastRefresh = useFastFresh()

    const context ={
        tableRefresh:refresh,  
        setTableRefresh, 
        filterState:orderState        
    }

    const handleButtonMenuClick = (newIndex) => {
        // setFilterOrderState(newIndex)
        if(newIndex === 0) setOrderState(OrderState.Active)
        if(newIndex === 1) setOrderState(OrderState.Completed)
        setMenuIndex(newIndex)
        
    }
    const [handleAdd] = useModal(<AddRowModal />)
    useEffect(()=>{
        if(refresh < 0) return
        if(!account) return
        YieldSwapContract.getSwapIds(account).then(async (ids)=>{
            setSwapIds(ids)
        }).catch(err=>{
            console.log(err)            
            // toastError('Error', err.toString())
        })
    }, [YieldSwapContract, account, toastError, refresh, fastRefresh ])

    console.log(context, orderState, "============-34324 ")
    return (        
        <Page>            
            <Wrapper>
                <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                    <ButtonMenuItem>
                        {t('Active')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Closed')}
                    </ButtonMenuItem>
                </ButtonMenu>
                <Button variant="secondary" scale="md" mr="1em" onClick={handleAdd}> Add </Button>
            </Wrapper>
            <YieldPartyContext.Provider value={context}>
                <YieldPartyTable data={swapIds}/>
            </YieldPartyContext.Provider>
            
        </Page>
    )
}

export default YieldParty