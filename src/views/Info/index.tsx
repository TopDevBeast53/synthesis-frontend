import React from 'react'
import { Route } from 'react-router-dom'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
// import InfoChain from './components/InfoChain'
import InfoNav from './components/InfoNav'
import Overview from './Overview'
import Pools from './Pools'
import PoolPage from './Pools/PoolPage'
import Tokens from './Tokens'
import RedirectInvalidToken from './Tokens/redirects'

const Info: React.FC = () => {
  return (
    <>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      {/* <InfoChain /> */}
      <InfoNav />
      <Route path="/data" exact>
        <Overview />
      </Route>
      <Route path="/data/trading-pools" exact>
        <Pools />
      </Route>
      <Route path="/data/tokens" exact>
        <Tokens />
      </Route>
      <Route exact path={['/data/tokens/:address', '/data/token/:address']} component={RedirectInvalidToken} />
      <Route exact path={['/data/trading-pools/:address', '/data/trading-pool/:address', '/data/pair/:address']} component={PoolPage} />
    </>
  )
}

export default Info
