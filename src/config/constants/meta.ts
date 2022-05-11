import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
    title: 'Helix',
    description: 'TODO',
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
                title: `${t('Home')} | ${t('Helix')}`,
            }
        case '/swap':
            return {
                title: `${t('Exchange')} | ${t('Helix')}`,
            }
        case '/add':
            return {
                title: `${t('Add Liquidity')} | ${t('Helix')}`,
            }
        case '/remove':
            return {
                title: `${t('Remove Liquidity')} | ${t('Helix')}`,
            }
        case '/liquidity':
            return {
                title: `${t('Liquidity')} | ${t('Helix')}`,
            }
        case '/find':
            return {
                title: `${t('Import Pool')} | ${t('Helix')}`,
            }
        case '/competition':
            return {
                title: `${t('Trading Battle')} | ${t('Helix')}`,
            }
        case '/prediction':
            return {
                title: `${t('Prediction')} | ${t('Helix')}`,
            }
        case '/prediction/leaderboard':
            return {
                title: `${t('Leaderboard')} | ${t('Helix')}`,
            }
        case '/farms':
            return {
                title: `${t('Farms')} | ${t('Helix')}`,
            }
        case '/farms/auction':
            return {
                title: `${t('Farm Auctions')} | ${t('Helix')}`,
            }
        case '/pools':
            return {
                title: `${t('Pools')} | ${t('Helix')}`,
            }
        case '/lottery':
            return {
                title: `${t('Lottery')} | ${t('Helix')}`,
            }
        case '/ifo':
            return {
                title: `${t('Initial Farm Offering')} | ${t('Helix')}`,
            }
        case '/teams':
            return {
                title: `${t('Leaderboard')} | ${t('Helix')}`,
            }
        case '/voting':
            return {
                title: `${t('Voting')} | ${t('Helix')}`,
            }
        case '/voting/proposal':
            return {
                title: `${t('Proposals')} | ${t('Helix')}`,
            }
        case '/voting/proposal/create':
            return {
                title: `${t('Make a Proposal')} | ${t('Helix')}`,
            }
        case '/info':
            return {
                title: `${t('Overview')} | ${t('Helix Info & Analytics')}`,
                description: 'View statistics for Helix exchanges.',
            }
        case '/info/pools':
            return {
                title: `${t('Pools')} | ${t('Helix Info & Analytics')}`,
                description: 'View statistics for Pancakeswap exchanges.',
            }
        case '/info/tokens':
            return {
                title: `${t('Tokens')} | ${t('Helix Info & Analytics')}`,
                description: 'View statistics for Helix exchanges.',
            }
        case '/nfts':
            return {
                title: `${t('Overview')} | ${t('Helix')}`,
            }
        case '/nfts/collections':
            return {
                title: `${t('Collections')} | ${t('Helix')}`,
            }
        case '/nfts/activity':
            return {
                title: `${t('Activity')} | ${t('Helix')}`,
            }
        case '/nfts/profile':
            return {
                title: `${t('Profile')} | ${t('Helix')}`,
            }
        case '/pancake-squad':
            return {
                title: `${t('Pancake Squad')} | ${t('Helix')}`,
            }
        default:
            return null
    }
}
