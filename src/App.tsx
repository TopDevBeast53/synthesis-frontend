// import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import useEagerConnect from 'hooks/useEagerConnect'
import useScrollOnRouteChange from 'hooks/useScrollOnRouteChange'
import useUserAgent from 'hooks/useUserAgent'
import React, { lazy } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { ResetCSS, useMatchBreakpoints } from 'uikit'
import PageLoader from './components/Loader/PageLoader'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import { useInactiveListener } from './hooks/useInactiveListener'
import useSentryUser from './hooks/useSentryUser'
import history from './routerHistory'
import GlobalStyle from './style/Global'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './views/AddLiquidity/redirects'
// Views included in the main bundle
import Pools from './views/Pools'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import Swap from './views/Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'
import Vault from './views/Vault'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const FarmAuction = lazy(() => import('./views/FarmAuction'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))
// const PredictionsLeaderboard = lazy(() => import('./views/Predictions/Leaderboard'))
const Voting = lazy(() => import('./views/Voting'))
const Proposal = lazy(() => import('./views/Voting/Proposal'))
const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'))
const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))
const Migrator = lazy(() => import('./views/LiquidityMigration'))
const NftStaking = lazy(() => import('./views/NftStaking'))
const NftYieldBoosting = lazy(() => import('./views/NftYieldBoosting'))
const SwapLiquidity = lazy(() => import('./views/SwapLiquidity'))
const SwapYield = lazy(() => import('./views/SwapYield'))
const Referrals = lazy(() => import('./views/Referrals'))
// const Info = lazy(() => import('./views/Info'))
// const NftMarket = lazy(() => import('./views/Nft/market'))
// const ProfileCreation = lazy(() => import('./views/ProfileCreation'))
// const PancakeSquad = lazy(() => import('./views/PancakeSquad'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // const { account } = useWeb3React()

  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  useScrollOnRouteChange()
  useUserAgent()
  useInactiveListener()
  useSentryUser()
  
  const {isMobile} = useMatchBreakpoints()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle
        backgroundImageURL={
          ['swap', 'geobot-staking'].includes(window.location.href.split('/')?.[3])
            ? '/images/SwapBackground.svg'
            : isMobile 
            ? '/images/MainBackgroundb.jpg'
            : '/images/MainBackground.svg'  
        }
      />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route exact path="/farms/auction">
              <FarmAuction />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Pools />
            </Route>
            <Route path="/vaults">
              <Vault />
            </Route>
            <Route path="/migration">
              <Migrator />
            </Route>
            <Route path="/geobot-staking">
              <NftStaking />
            </Route>
            <Route path="/geobot-yield-boosting">
              <NftYieldBoosting />
            </Route>
            <Route path="/referrals">
              <Referrals />
            </Route>
            <Route path="/lps-swap">
              <SwapLiquidity />
            </Route>
            <Route path="/yield-swap">
              <SwapYield />
            </Route>
            {/* 
            <Route path="/lottery">
              <Lottery />
            </Route>
            <Route path="/ifo">
              <Ifos />
            </Route>
            <Route exact path="/teams">
              <Teams />
            </Route>
            <Route path="/teams/:id">
              <Team />
            </Route>
            <Route path="/create-profile">
              <ProfileCreation />
            </Route>
            <Route path="/competition">
              <TradingCompetition />
            </Route>
            <Route exact path="/prediction">
              <Predictions />
            </Route>
            <Route path="/prediction/leaderboard">
              <PredictionsLeaderboard />
            </Route>
            */}
            <Route exact path="/voting">
              <Voting />
            </Route>
            <Route exact path="/voting/proposal/create">
              <CreateProposal />
            </Route>
            <Route path="/voting/proposal/:id">
              <Proposal />
            </Route>

            {/* NFT */}
            {/* <Route path="/nfts">
              <NftMarket />
            </Route>

            <Route path="/pancake-squad">
              <PancakeSquad />
            </Route> */}

            {/* Info pages */}
            {/* <Route path="/info">
              <Info />
            </Route> */}

            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* Redirect */}
            <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>
            {/* <Route path="/staking">
              <Redirect to="/pools" />
            </Route> */}
            {/* <Route path="/syrup">
              <Redirect to="/pools" />
            </Route> */}
            {/* <Route path="/collectibles">
              <Redirect to="/nfts" />
            </Route> */}
            {/* <Route path="/profile">
              <Redirect to={`${nftsBaseUrl}/profile/${account?.toLowerCase() || ''}`} />
            </Route> */}

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <ToastListener />
      <SubgraphHealthIndicator />
    </Router>
  )
}

export default React.memo(App)
