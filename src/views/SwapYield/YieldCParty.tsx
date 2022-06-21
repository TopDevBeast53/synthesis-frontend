import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import Loading from 'components/Loading'
import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap } from 'hooks/useContract'
import { includes } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useMatchBreakpoints, useModal } from 'uikit'
import YieldCPartyTable from './components/YieldCParty/Table'
import CreateSwapModal from './components/YieldParty/Modals/CreateOrderDialog'
import { YieldCPartyContext } from './context'
import { useYieldSwap } from './hooks/useSwapYield'
import { SwapState } from './types'

const Wrapper = styled.div`  
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  a {
    padding-left: 12px;
    padding-right: 12px;
  }
  text-align:center;
  ${({ theme }) => theme.mediaQueries.md} {
    text-align:left;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
    display: flex;
  }
`

const YieldCParty = () => {
  const { t } = useTranslation()
  const yieldSwapContract = useHelixYieldSwap()
  const { account } = useWeb3React()
  const { fetchSwapData } = useYieldSwap()
  const {isMobile} = useMatchBreakpoints()

  const [menuIndex, setMenuIndex] = useState(SwapState.All)
  const [swaps, setSwaps] = useState<any[]>()
  const [hasBidOnSwap, setHasBidOnSwap] = useState([])
  const [refresh, setTableRefresh] = useState(0)
  const [loading, setLoading] = useState(false)

  const filteredSwaps = useMemo(() => {
    if(!swaps) return[]
    if(!account) return []
    if (menuIndex === SwapState.Pending)
      return swaps.filter((s, i) => s.status === 1 && includes(hasBidOnSwap, i))
    if (menuIndex === SwapState.Finished) return swaps.filter((s) => s.status === 2 && s.seller.party !== account)
    if (menuIndex === SwapState.All)
      return swaps.filter((s, i) => s.status === 0 && !includes(hasBidOnSwap, i) && s.seller.party !== account)
    if (menuIndex === SwapState.Applied) return swaps.filter((s, i) => s.status === 0 && includes(hasBidOnSwap, i))
    return []
  }, [menuIndex, swaps, hasBidOnSwap, account])

  const handleButtonMenuClick = (newIndex) => {
    setMenuIndex(newIndex)
  }

  const [handleAdd] = useModal(<CreateSwapModal />)
  useEffect(() => {
    if (refresh < 0) return
    setLoading(true)
    let isSubscribed = true
    let bidFetched = true
    try {
      // fetch swaps
      fetchSwapData().then((fetchedSwaps) => {
        if(isSubscribed) {
          const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => {
            return { ...s, id: i }
          })
          setSwaps(fetchedSwapsWithIds)
        }
      });
      
      // fetch bid Ids
      yieldSwapContract.getBidderSwapIds(account).then((fetchBidderSwapIds) => {
        if(bidFetched) {
          const normalNumberBidIds = fetchBidderSwapIds.map((b) => b.toNumber())
          setHasBidOnSwap(normalNumberBidIds)
        }
      })
      
    } catch (err) {
      console.error(err)
    }
    setLoading(false)

    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false
      bidFetched = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, refresh, menuIndex, yieldSwapContract])

  return (
    <>
      {
        <Page>
          {
            account && (
              <Wrapper>
                {/* TODO: Should be read from constants */}
                  <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
                    <ButtonMenuItem>{t('Open')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('My Bids')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Active Swaps')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Completed Swaps')}</ButtonMenuItem>
                  </ButtonMenu>
                <Button variant="secondary" scale={isMobile ? "sm" : "md"} mr="1em" onClick={handleAdd} 
                  style={isMobile ? {marginTop: "32px", textAlign: "center", marginLeft:"auto", marginRight:"auto", display:"block"}: {}}>
                  Create Swap
                </Button>
              </Wrapper>
            )
          }
          {
            !swaps?
            <Loading/>
            :
            <YieldCPartyContext.Provider
              value={{ tableRefresh: refresh, setTableRefresh, updateMenuIndex: setMenuIndex }}
            >
              <YieldCPartyTable swaps={filteredSwaps} state={menuIndex} loading={loading} />
            </YieldCPartyContext.Provider>
          }
        </Page>
      }
    </>
  )
}

export default YieldCParty
