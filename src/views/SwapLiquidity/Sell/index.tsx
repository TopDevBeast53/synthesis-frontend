import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap } from 'hooks/useContract'
import { useFastFresh } from 'hooks/useRefresh'
import useToast from 'hooks/useToast'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useModal } from 'uikit'
import { SwapLiquidityContext } from '../context'
import CreateOrderDialog from './Modals/CreateOrderDialog'
import SellTable from './SellTable'
import { OrderState } from '../types'



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

const Sell = ()=>{
    const { t } = useTranslation()
    const { toastError } = useToast()
    const YieldSwapContract = useHelixYieldSwap()  
    const {account} = useWeb3React()
    const [menuIndex, setMenuIndex] = useState(0)    
    const [swapIds, setSwapIds] = useState([])
       
    const fastRefresh = useFastFresh()
    const {tableRefresh, setFilterState} = useContext(SwapLiquidityContext)

    

    const handleButtonMenuClick = (newIndex) => {
        // setFilterOrderState(newIndex)
        if(newIndex === 0) setFilterState(OrderState.Active)
        if(newIndex === 1) setFilterState(OrderState.Completed)
        setMenuIndex(newIndex)
        
    }
    const [handleAdd] = useModal(<CreateOrderDialog />)
    useEffect(()=>{
        console.log("============= refersh ==============")
        if(tableRefresh < 0) return
        if(!account) return
        YieldSwapContract.getSwapIds(account).then(async (ids)=>{
            setSwapIds(ids)
            console.log("==========  swapids  ==========", ids)
        }).catch(err=>{
            console.log(err)            
            // toastError('Error', err.toString())
        })
    }, [YieldSwapContract, account, toastError, tableRefresh, fastRefresh ])

    
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
            <SellTable data={swapIds}/>            
            
        </Page>
    )
}

export default Sell