import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { filter, includes } from 'lodash'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useHelixLpSwap } from 'hooks/useContract'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useModal } from 'uikit'
import { SwapLiquidityContext } from '../context'
import BuyTable from './BuyTable'
import { SwapState } from '../types'
import CreateOrderDialog from '../Sell/Modals/CreateOrderDialog'
import { useLpSwap } from '../hooks/useLPSwap'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1em;
  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

const Sell = () => {
  const { t } = useTranslation()
  const LpSwapContract = useHelixLpSwap()
  const { account } = useWeb3React()
  const { fetchSwapData } = useLpSwap()
  const [menuIndex, setMenuIndex] = useState(SwapState.All)
  const [swaps, setSwaps] = useState([])
  const [bidIdsPerUser, setBidIdsPerUser] = useState([])
  const { tableRefresh, setFilterState } = useContext(SwapLiquidityContext)
  const filteredSwaps = useMemo(() => {
    if (menuIndex === SwapState.Finished) return filter(swaps, { isOpen: false, buyer: account })
    if (menuIndex === SwapState.All)
      return swaps.filter((s, i) => s.isOpen && !includes(bidIdsPerUser, i) && s.seller !== account)
    if (menuIndex === SwapState.Applied) return swaps.filter((s, i) => s.isOpen && includes(bidIdsPerUser, i))
    return []
  }, [menuIndex, swaps, bidIdsPerUser, account])

  const [handleAdd] = useModal(<CreateOrderDialog />)

  const handleButtonMenuClick = (newIndex) => {
    setFilterState(newIndex)
    setMenuIndex(newIndex)
  }
  useEffect(() => {
    async function fetchData() {
      if (tableRefresh < 0) return
  
      // fetch swaps
      const fetchedSwaps = await fetchSwapData();
      const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => ({ ...s, id: i }))
      setSwaps(fetchedSwapsWithIds)

      if (!account) return
  
      // fetch bid Ids
      LpSwapContract.getBidderSwapIds(account).then((fetchBidderSwapIds) => {
        const normalNumberBidIds = fetchBidderSwapIds.map((b) => b.toNumber())
        setBidIdsPerUser(normalNumberBidIds)
      })
    }
    fetchData()
  }, [LpSwapContract, account, tableRefresh, fetchSwapData])

  return (
    <Page>
      {
        account && (
          <Wrapper>
            <ButtonMenu activeIndex={menuIndex} scale="sm" variant="subtle" onItemClick={handleButtonMenuClick}>
              <ButtonMenuItem>{t('Open')}</ButtonMenuItem>
              <ButtonMenuItem>{t('My Bids')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Executed')}</ButtonMenuItem>
            </ButtonMenu>
            <Button variant="secondary" scale="md" mr="1em" onClick={handleAdd}>
              {' '}
              Create Swap{' '}
            </Button>
          </Wrapper>
        )
      }
      <BuyTable data={filteredSwaps} />
    </Page>
  )
}

export default Sell
