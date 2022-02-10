import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'AuraSwap',
  description:
    'TODO',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('AuraSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('AuraSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('AuraSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('AuraSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('AuraSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('AuraSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('AuraSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('AuraSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('AuraSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('AuraSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('AuraSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('AuraSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('AuraSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('AuraSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('AuraSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('AuraSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('AuraSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('AuraSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('AuraSwap Info & Analytics')}`,
        description: 'View statistics for AuraSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('AuraSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('AuraSwap Info & Analytics')}`,
        description: 'View statistics for AuraSwap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('AuraSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('AuraSwap')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('AuraSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('AuraSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('AuraSwap')}`,
      }
    default:
      return null
  }
}
