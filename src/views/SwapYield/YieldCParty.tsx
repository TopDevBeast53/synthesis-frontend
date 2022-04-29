import React, { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { multicallv2 } from 'utils/multicall'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, ButtonMenu, ButtonMenuItem } from 'uikit'
import { filter } from 'lodash'
import { useHelixYieldSwap } from 'hooks/useContract'
import Page from 'components/Layout/Page'
import YieldCPartyTable from './components/YieldCParty/Table'
import { SwapState } from './types'
import CircleLoader from '../../components/Loader/CircleLoader'
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
    const [loading, setLoading] = useState(false)
    const [refresh, setTableRefresh] = useState(0)

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

        const fetchData = async () => {
            setLoading(true)

            // TODO: Should be update
            const bidsLastIndex = await yieldSwapContract.getBidId();
            const fetchedSwaps = await yieldSwapContract.getAllSwaps()
            const swapIds = Array.from(Array(fetchedSwaps.length).keys())
            const bidIds = Array.from(Array(bidsLastIndex.toNumber() + 1).keys())
            const fetchedSwapIds = await Promise.all(swapIds.map((i) => yieldSwapContract.hasBidOnSwap(account, i)))
            const fetchedBids = await Promise.all(bidIds.map((b) => yieldSwapContract.bids(b)))
            const filteredBids = fetchedBids.map((b, i) => {
                return {...b, id: i}
            })
            setBids(filteredBids)
            setHasBidOnSwap(fetchedSwapIds)
            const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => {
                return {...s, id: i}
            })
            setSwaps(fetchedSwapsWithIds)
            setLoading(false)
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, refresh])

    return (
        <>
            {
                loading 
                ? (
                    <Flex
                      position="relative"
                      height="300px"
                      justifyContent="center"
                      py="4px"
                    >
                      <Flex justifyContent="center" style={{ paddingBottom: '8px' }}>
                        <Text fontSize="18px" bold>
                          Loading...
                        </Text>
                      </Flex>
                      <Flex justifyContent="center">
                        <CircleLoader size="30px"/>
                      </Flex>
                    </Flex>
                  ) : (
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
                        <YieldCPartyTable swaps={filteredSwaps()} state={menuIndex} bids={bids}/>
                        </YieldCPartyContext.Provider>
                     </Page>
                  )
            }
        </>
    )
}

export default YieldCParty