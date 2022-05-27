import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { filter, includes } from 'lodash'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useHelixLpSwap } from 'hooks/useContract'
import styled from 'styled-components'
import { Button, ButtonMenu, ButtonMenuItem, useMatchBreakpoints, useModal } from 'uikit'
import Loading from 'components/Loading'
import { SwapLiquidityContext } from '../context'
import BuyTable from './BuyTable'
import { SwapState } from '../types'
import CreateOrderDialog from '../Sell/Modals/CreateOrderDialog'
import { useLpSwap } from '../hooks/useLPSwap'

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

const Sell = () => {
  const { t } = useTranslation()
  const LpSwapContract = useHelixLpSwap()
  const { account } = useWeb3React()
  const { fetchSwapData } = useLpSwap()
  const [menuIndex, setMenuIndex] = useState(SwapState.All)
  const [swaps, setSwaps] = useState<any[]>()
  const [biddedSwapIdsOfCurrentUser, setBidIdsPerUser] = useState([])
  const { tableRefresh, setFilterState } = useContext(SwapLiquidityContext)
  const {isMobile} = useMatchBreakpoints()
  const filteredSwaps = useMemo(() => {
    if(!swaps) return []
    if(!account) return []
    if (menuIndex === SwapState.Finished) return filter(swaps, { isOpen: false, buyer: account })
    if (menuIndex === SwapState.All)
      return swaps.filter((s, i) => s.isOpen && !includes(biddedSwapIdsOfCurrentUser, i) && s.seller !== account)
    if (menuIndex === SwapState.Applied) return swaps.filter((s, i) => s.isOpen && includes(biddedSwapIdsOfCurrentUser, i))
    return []
  }, [menuIndex, swaps, biddedSwapIdsOfCurrentUser, account])

  const [handleAdd] = useModal(<CreateOrderDialog />)

  const handleButtonMenuClick = (newIndex) => {
    setFilterState(newIndex)
    setMenuIndex(newIndex)
  }
  useEffect(()=>{
    setFilterState(menuIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {    
    async function fetchData() {
      if (tableRefresh < 0) return
      // fetch swaps
      const fetchedSwaps = await fetchSwapData();
      const fetchedSwapsWithIds = fetchedSwaps.map((s, i) => ({ ...s, id: i }))
      setSwaps(fetchedSwapsWithIds)
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LpSwapContract.address, tableRefresh])

  useEffect(()=>{    
    if (tableRefresh < 0) return    
    if (!account) return
    async function fetchBidSwapId() {      
      const fetchBidderSwapIds = await LpSwapContract.getBidderSwapIds(account)
      const normalNumberBidIds = fetchBidderSwapIds.map((b) => b.toNumber())      
      setBidIdsPerUser(normalNumberBidIds)
    }
    // fetch bid Ids
    fetchBidSwapId()
  }, [account,tableRefresh, LpSwapContract])    
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
            <Button variant="secondary" scale={isMobile?"sm":"md"} mr="1em" onClick={handleAdd}
                style={isMobile ? {marginTop: "32px", textAlign: "center", marginLeft:"auto", marginRight:"auto", display:"block"}: {}}
            >
              {' '}
              Create Swap{' '}
            </Button>
          </Wrapper>
        )
      }
      {
        swaps===undefined?
        <Loading/>
        :
        <BuyTable data={filteredSwaps} />
      }
      
    </Page>
  )
}

export default Sell
