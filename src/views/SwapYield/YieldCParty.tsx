import React, { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, ButtonMenu, ButtonMenuItem, useModal } from 'uikit'
import { includes } from 'lodash'
import { useHelixYieldSwap } from 'hooks/useContract'
import Page from 'components/Layout/Page'
import YieldCPartyTable from './components/YieldCParty/Table'
import { SwapState } from './types'
import { YieldCPartyContext } from './context'
import CreateSwapModal from './components/YieldParty/Modals/CreateOrderDialog'
import { useYieldSwap } from './hooks/useSwapYield'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

const YieldCParty = () => {
  const { t } = useTranslation()
  const yieldSwapContract = useHelixYieldSwap()
  const { account } = useWeb3React()
  const { fetchSwapData, fetchBids } = useYieldSwap()

  const [menuIndex, setMenuIndex] = useState(SwapState.All)
  const [swaps, setSwaps] = useState([])
  const [bids, setBids] = useState([])
  const [hasBidOnSwap, setHasBidOnSwap] = useState([])
  const [refresh, setTableRefresh] = useState(0)
  const [loading, setLoading] = useState(false)

  const filteredSwaps = useMemo(() => {
    if(!account) return []
    if (menuIndex === SwapState.Pending)
      return swaps.filter((s, i) => s.status === 1 && includes(hasBidOnSwap, i))
    if (menuIndex === SwapState.Finished) return swaps.filter((s) => s.status === 2 && s.seller.party === account)
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
  
          const bidIds = fetchedSwaps.reduce((prev, cur) => prev.concat(cur.bidIds), [])
          fetchBids(bidIds).then((fetchedBids) => {
            const filteredBids = fetchedBids.map((b, i) => {
              return { ...b, id: i }
            })
            setBids(filteredBids)
          });
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
  }, [account, refresh, menuIndex])

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
                <Button variant="secondary" scale="md" mr="1em" onClick={handleAdd}>
                  {' '}
                  Create Swap{' '}
                </Button>
              </Wrapper>
            )
          }
          <YieldCPartyContext.Provider
            value={{ tableRefresh: refresh, setTableRefresh, updateMenuIndex: setMenuIndex }}
          >
            <YieldCPartyTable swaps={filteredSwaps} state={menuIndex} bids={bids} loading={loading} />
          </YieldCPartyContext.Provider>
        </Page>
      }
    </>
  )
}

export default YieldCParty
