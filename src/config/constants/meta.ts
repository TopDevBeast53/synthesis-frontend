import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Aura',
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
        title: `${t('Home')} | ${t('Aura')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('Aura')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Aura')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Aura')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Aura')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Aura')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Aura')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Aura')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('Aura')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Aura')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Aura')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Aura')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Aura')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Aura')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Aura')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Aura')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Aura')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Aura')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('Aura Info & Analytics')}`,
        description: 'View statistics for Aura exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('Aura Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('Aura Info & Analytics')}`,
        description: 'View statistics for Aura exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('Aura')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('Aura')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('Aura')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('Aura')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('Aura')}`,
      }
    default:
      return null
  }
}
