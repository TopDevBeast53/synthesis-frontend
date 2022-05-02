import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { filter, includes } from 'lodash'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useHelixLpSwap } from 'hooks/useContract'
import { useFastFresh } from 'hooks/useRefresh'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import { SwapLiquidityContext } from '../context'
import BuyTable from './BuyTable'
import { SwapState } from '../types'

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
    const LpSwapContract = useHelixLpSwap()  
    const {account} = useWeb3React()
    const [menuIndex, setMenuIndex] = useState(0)    
    const [swaps, setSwaps] = useState([])
    const [bidIdsPerUser, setBidIdsPerUser] = useState([])
    const fastRefresh = useFastFresh()
    const {tableRefresh, setFilterState} = useContext(SwapLiquidityContext)
    const filteredSwaps = useMemo(() => {        
        if(menuIndex === SwapState.Finished) return filter(swaps, {isOpen: false, buyer: account})
        if(menuIndex === SwapState.All) return swaps.filter((s, i) => s.isOpen && !includes(bidIdsPerUser, i) && s.seller !== account)         
        if(menuIndex === SwapState.Applied) return swaps.filter((s, i) => s.isOpen && includes(bidIdsPerUser, i))            
        return []
    }, [menuIndex, swaps, bidIdsPerUser, account])

    const handleButtonMenuClick = (newIndex) => {
        setFilterState(newIndex)
        setMenuIndex(newIndex)

    }    
    useEffect(()=>{
        if(tableRefresh < 0) return
        if(!account) return
        // fetch swaps
        LpSwapContract.getSwaps().then((fetchedSwaps) => {
            const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => ({...s, id: i}))
            setSwaps(fetchedSwapsWithIds)
        })

        // fetch bid Ids
        LpSwapContract.getBidderSwapIds(account).then((fetchBidderSwapIds) => {
            const normalNumberBidIds = fetchBidderSwapIds.map(b => b.toNumber())
            setBidIdsPerUser(normalNumberBidIds)
        })
    }, [LpSwapContract, account, tableRefresh, fastRefresh ])

    return (        
        <Page>            
            <Wrapper>
                <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                    <ButtonMenuItem>
                        {t('All')}
                    </ButtonMenuItem>
                    <ButtonMenuItem>
                        {t('Applied')}
                    </ButtonMenuItem>
                    <ButtonMenuItem >
                        {t('Finished')}
                    </ButtonMenuItem>
                </ButtonMenu>                
            </Wrapper>            
            <BuyTable data={filteredSwaps}/>            
        </Page>
    )
}

export default Sell