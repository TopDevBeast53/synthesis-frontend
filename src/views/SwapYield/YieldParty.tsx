import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useERC20, useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useModal } from 'uikit'
import AddRowModal from './components/YieldParty/CreateOrderDialog'
import YieldPartyTable from './components/YieldParty/Table'
import { PartyOrderData } from './dummy'
import { OrderState } from './types'
import { YieldPartyContext } from './context' 

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
    const { toastSuccess, toastError } = useToast()
    const YieldSwapContract = useHelixYieldSwap()  
    const {account} = useWeb3React()
    const [menuIndex, setMenuIndex] = useState(0)
    const [filterOrderState, setFilterOrderState]=useState(OrderState.Active)    
    const [swapIds, setSwapIds] = useState([])
    const [refresh,setTableRefresh] = useState(0)
    const handleButtonMenuClick = (newIndex) => {
        setFilterOrderState(newIndex)
        setMenuIndex(newIndex)
    }
    const [handleAdd] = useModal(<AddRowModal />)
    useEffect(()=>{
        if(refresh < 0) return
        if(!account) return
        console.log("===========refresh= ========== ", refresh)        
        YieldSwapContract.getSwapIds(account).then(async (ids)=>{
            setSwapIds(ids)
        }).catch(err=>{
            console.log("=============Error ========", err)
            // alert("Error")
            toastError('Error', err.toString())
        })
    }, [YieldSwapContract, account, toastError, refresh ])

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
                <Button variant="secondary" scale="md" mr="1em" onClick={handleAdd}> Add </Button>
            </Wrapper>
            <YieldPartyContext.Provider value={{tableRefresh:refresh,  setTableRefresh}}>
                <YieldPartyTable data={swapIds} />
            </YieldPartyContext.Provider>
            
        </Page>
    )
}

export default YieldParty