import { MenuItemsType } from 'uikit'
import { DropdownMenuItemType } from 'uikit/components/DropdownMenu/types'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
    {
        label: t('Trade'),
        icon: 'Swap',
        href: '/swap',
        // showItemsOnMobile: false,
        items: [
            {
                label: t('Exchange'),
                href: '/swap',
            },
            {
                type: DropdownMenuItemType.DIVIDER,
            },
            {
                label: t('Liquidity'),
                href: '/liquidity',
            },
            {
                type: DropdownMenuItemType.DIVIDER,
            },
            {
                label: 'Migrate',
                href: '/migration',
            },
        ],
    },
    {
        label: t('Earn'),
        href: '/farms',
        icon: 'Earn1',
        items: [
            {
                label: t('Farms'),
                href: '/farms',
            },
            {
                type: DropdownMenuItemType.DIVIDER,
            },
            {
                label: t('Pools'),
                href: '/pools',
            },
            {
                type: DropdownMenuItemType.DIVIDER,
            },
            {
                label: t('Vaults'),
                href: '/vaults',
            },
        ],
    },
    // {
    //     label: t('Yield Swaps'),
    //     href: '/lps-swap',
    //     mobileLabel:"YS",
    //     icon: 'YieldSwap',
    //     items: [
    //         {
    //             label: t('Swap LPs'),
    //             href: '/lps-swap',
    //         },
    //         // {
    //         //     type: DropdownMenuItemType.DIVIDER,
    //         // },
    //         // {
    //         //     label: t('Swap Yield'),
    //         //     href: '/yield-swap',
    //         // },
    //     ],
    // },
    {
        label: t('Referrals'),
        href: '/referrals',
        icon: 'Referals',
        showItemsOnMobile:false,
        items: [],
    },
    {
        label: t('NFT'),
        href: '/geobot-staking',
        icon: 'NFT1',
        items: [
            {
                label: 'Geobot Staking',
                href: '/geobot-staking',
            },
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
        icon:'Vote1',
        showItemsOnMobile:false,
    },
    {
        label: t('Data'),
        href: '/data',
        icon: 'Chart',
        showItemsOnMobile:false,
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
            
            // {
            //     type: DropdownMenuItemType.DIVIDER,
            // },
            //     {
            //       label: t('IFO'),
            //       href: '/ifo',
            //       status: menuStatus.SOON,
            //     },
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
