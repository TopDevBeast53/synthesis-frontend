import { MenuItemsType } from 'uikit'
import { DropdownMenuItemType } from 'uikit/components/DropdownMenu/types'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
    {
        label: t('Trade'),
        icon: 'Swap',
        href: '/swap',
        showItemsOnMobile: false,
        items: [
            {
                label: t('Exchange'),
                href: '/swap',
            },
            {
                label: t('Liquidity'),
                href: '/liquidity',
            },
        ],
    },
    {
        label: t('Earn'),
        href: '/farms',
        icon: 'Earn',
        items: [
            {
                label: t('Farms'),
                href: '/farms',
            },
            {
                label: t('Pools'),
                href: '/pools',
            },
            {
                label: t('Vault'),
                href: '/vault',
            },
        ],
    },
    {
        label: t('Yield Swaps'),
        href: '/lps-swap',
        icon: 'Earn',
        items: [
            {
                label: t('Swap LPs'),
                href: '/lps-swap',
            },
            {
                label: t('Swap Yield'),
                href: '/yield-swap',
            },
        ],
    },
    {
        label: t('Referrals'),
        href: '/referrals',
        icon: 'Earn',
        items: [],
    },
    {
        label: t('NFT'),
        href: '/geobot-staking',
        icon: 'Earn',
        items: [
            {
                label: 'Geobot Staking',
                href: '/geobot-staking',
            },
            // {
            //     label: 'Yield Boosting',
            //     href: '/geobot-yield-boosting',
            // },
            {
                type: DropdownMenuItemType.DIVIDER,
            },
            {
                label: 'Geobot bridge',
                href: 'https://nexus.helix.finance',
                target: '_blank',
                type: DropdownMenuItemType.EXTERNAL_LINK,
            },
        ],
    },
    {
        label: t('Voting'),
        href: '/voting',
    },
    // {
    //   label: t('Win'),
    //   href: '/prediction',
    //   icon: 'Trophy',
    //   items: [
    //     {
    //       label: t('Trading Competition'),
    //       href: '/competition',
    //     },
    //     {
    //       label: t('Prediction (BETA)'),
    //       href: '/prediction',
    //     },
    //     {
    //       label: t('Lottery'),
    //       href: '/lottery',
    //     },
    //   ],
    // },
    // {
    //   label: t('NFT'),
    //   href: `${nftsBaseUrl}`,
    //   icon: 'Nft',
    //   items: [
    //     {
    //       label: t('Overview'),
    //       href: `${nftsBaseUrl}`,
    //     },
    //     {
    //       label: t('Collections'),
    //       href: `${nftsBaseUrl}/collections`,
    //     },
    //     {
    //       label: t('Activity'),
    //       href: `${nftsBaseUrl}/activity`,
    //     },
    //   ],
    // },
    {
        label: '',
        href: '#',
        icon: 'More',
        hideSubNav: true,
        items: [
            //     {
            //       label: t('Info'),
            //       href: '/info',
            //     },
            //     {
            //       label: t('IFO'),
            //       href: '/ifo',
            //       status: menuStatus.SOON,
            //     },
            {
                label: 'Migrate',
                href: '/migration',
                icon: 'Earn',
            },
            {
                label: 'Docs',
                href: 'https://geometry.gitbook.io/helix',
                type: DropdownMenuItemType.EXTERNAL_LINK,
            },
            
            //     {
            //       type: DropdownMenuItemType.DIVIDER,
            //     },
            //     {
            //       label: t('Leaderboard'),
            //       href: '/teams',
            //     },
            //     {
            //       type: DropdownMenuItemType.DIVIDER,
            //     },
            //     {
            //       label: t('Blog'),
            //       href: 'https://medium.com/pancakeswap',
            //       type: DropdownMenuItemType.EXTERNAL_LINK,
            //     },
            //     {
            //       label: t('Docs'),
            //       href: 'https://docs.pancakeswap.finance',
            //       type: DropdownMenuItemType.EXTERNAL_LINK,
            //     },
        ],
    },
]

export default config
