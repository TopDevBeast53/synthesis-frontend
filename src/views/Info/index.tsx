import React from 'react'
import { Route } from 'react-router-dom'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
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
      <InfoNav />
      <Route path="/data" exact>
        <Overview />
      </Route>
      <Route path="/data/pools" exact>
        <Pools />
      </Route>
      <Route path="/data/tokens" exact>
        <Tokens />
      </Route>
      <Route exact path={['/data/tokens/:address', '/data/token/:address']} component={RedirectInvalidToken} />
      <Route exact path={['/data/pools/:address', '/data/pool/:address', '/data/pair/:address']} component={PoolPage} />
    </>
  )
}

export default Info
