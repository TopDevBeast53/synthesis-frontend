import React, { useState, useEffect } from 'react'
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
    const [hasBidOnSwap, setHasBidOnSwap] = useState([])
    const [filteredSwaps, setFilteredSwaps]=useState(filter(CPartySwapData, {state: menuIndex}))
    const [loading, setLoading] = useState(false)

    const handleButtonMenuClick = (newIndex) => {
        if(newIndex === SwapState.Pending) {
            setFilteredSwaps(filter(swaps, {isOpen: false, isWithdrawn: false}))
        }
        if(newIndex === SwapState.Finished) {
            setFilteredSwaps(filter(swaps, {isWithdrawn: true}))
        }

        if(newIndex === SwapState.All || newIndex === SwapState.Applied) {
            setFilteredSwaps(filter(swaps, {isOpen: true}))
        }
        setMenuIndex(newIndex)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const ids = await yieldSwapContract.getSwapId()
            const swapIds = Array.from(Array(ids.toNumber()).keys())

            const fetchedSwapIds = await Promise.all(swapIds.map((i) => yieldSwapContract.hasBidOnSwap(account, i)))
            const fetchedSwaps = await Promise.all(swapIds.map((i) => yieldSwapContract.swaps(i)))
            setHasBidOnSwap(fetchedSwapIds)
            setSwaps(fetchedSwaps)
            setLoading(false)
        }
        fetchData();
    }, [account, yieldSwapContract])

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
        </>
    )
}

export default YieldCParty