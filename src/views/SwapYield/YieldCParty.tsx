import React, { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text, ButtonMenu, ButtonMenuItem } from 'uikit'
import { filter } from 'lodash'
import { useHelixYieldSwap } from 'hooks/useContract'
import Page from 'components/Layout/Page'
import YieldCPartyTable from './components/YieldCParty/Table'
import { SwapState } from './types'
import { CPartySwapData } from './dummy'
import CircleLoader from '../../components/Loader/CircleLoader'
import { yieldSwapAddress } from './constants'

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
    const [filteredSwaps, setFilteredSwaps]=useState([])
    const [loading, setLoading] = useState(false)
    const filterSwap = (newIndex) => {
        if(newIndex === SwapState.Pending) {
            const filtered = swaps.filter((s, i) => !s.isOpen && !s.isWithdrawn && hasBidOnSwap[i])
            setFilteredSwaps(filtered)
        }
        if(newIndex === SwapState.Finished) {
            setFilteredSwaps(filter(swaps, {isWithdrawn: true}))
        }

        if(newIndex === SwapState.All) {
            const filtered = swaps.filter((s, i) => s.isOpen && !hasBidOnSwap[i])
            setFilteredSwaps(filtered)
        }

        if(newIndex === SwapState.Applied) {
            const filtered = swaps
                            .filter((s, i) => s.isOpen && hasBidOnSwap[i])
                            .map((s) => {
                                return {...s, approved: true}
                            })
            setFilteredSwaps(filtered)
        }
        setMenuIndex(newIndex)
    }

    const handleButtonMenuClick = (newIndex) => {
        filterSwap(newIndex)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const bidsLength = await yieldSwapContract.getBidId();
            const fetchedSwaps = await yieldSwapContract.getAllSwaps()
            const swapIds = Array.from(Array(fetchedSwaps.length).keys())
            const bidIds = Array.from(Array(bidsLength.toNumber()).keys())
            const fetchedSwapIds = await Promise.all(swapIds.map((i) => yieldSwapContract.hasBidOnSwap(account, i)))
            const fetchedBids = await Promise.all(bidIds.map((b) => yieldSwapContract.bids(b)))

            setBids(fetchedBids)
            setHasBidOnSwap(fetchedSwapIds)
            const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => {
                return {...s, id: i}
            })
            console.debug('???? bids',bidsLength, fetchedBids)
            setSwaps(fetchedSwapsWithIds)
            filterSwap(menuIndex)
            setLoading(false)
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

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
                      <YieldCPartyTable swaps={filteredSwaps} state={menuIndex}/>
                     </Page>
                  )
            }
        </>
    )
}

export default YieldCParty