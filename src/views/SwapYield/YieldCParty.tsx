import React, { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import { filter } from 'lodash'
import { useHelixYieldSwap } from 'hooks/useContract'
import Page from 'components/Layout/Page'
import YieldCPartyTable from './components/YieldCParty/Table'
import { SwapState } from './types'
import { YieldCPartyContext } from './context' 

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
    const { account } = useWeb3React()  

    const [menuIndex, setMenuIndex] = useState(SwapState.All)
    const [swaps, setSwaps] = useState([])
    const [bids, setBids] = useState([])
    const [hasBidOnSwap, setHasBidOnSwap] = useState([])
    const [refresh, setTableRefresh] = useState(0)
    const [loading, setLoading] = useState(false)

    const filteredSwaps = () => {        

        if(menuIndex === SwapState.Pending) return swaps.filter((s, i) => !s.isOpen && !s.isWithdrawn && hasBidOnSwap[i])                    
        if(menuIndex === SwapState.Finished) return filter(swaps, {isWithdrawn: true})
        if(menuIndex === SwapState.All) return swaps.filter((s, i) => s.isOpen && !hasBidOnSwap[i])         
        if(menuIndex === SwapState.Applied) return swaps.filter((s, i) => s.isOpen && hasBidOnSwap[i])            
        return []
    }

    const handleButtonMenuClick = (newIndex) => {
        setMenuIndex(newIndex)
    }

    useEffect(() => {
        if(refresh < 0) return
        setLoading(true)
        const fetchData = async () => {
            try {
                // TODO: Should be update
                const fetchedSwaps = await yieldSwapContract.getSwaps()
                const fetchedSwapIds = await yieldSwapContract.getBidderSwapIds(account)
    
                const bidIds = fetchedSwaps.reduce((prev, cur) => prev.concat(cur.bidIds), [])
                const fetchedBids = await Promise.all(bidIds.map((b) => yieldSwapContract.bids(b)))
                const filteredBids = fetchedBids.map((b, i) => {
                    return {...b, id: i}
                })
                setBids(filteredBids)
                console.debug('are you here?', filteredBids, refresh)
    
                setHasBidOnSwap(fetchedSwapIds)
                const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => {
                    return {...s, id: i}
                })
                setSwaps(fetchedSwapsWithIds)

            } catch(err) {
                console.error(err)
            }
            setLoading(false)
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, refresh])

    return (
        <>
            {
                <Page>
                    <Wrapper>
                        {/* TODO: Should be read from constants */}
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
                    <YieldCPartyContext.Provider value={{tableRefresh:refresh,  setTableRefresh}}>
                    <YieldCPartyTable swaps={filteredSwaps()} state={menuIndex} bids={bids} loading={loading}/>
                    </YieldCPartyContext.Provider>
                    </Page>
            }
        </>
    )
}

export default YieldCParty