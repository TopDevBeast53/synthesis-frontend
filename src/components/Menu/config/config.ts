import { MenuItemsType } from 'uikit'
import { DropdownMenuItemType } from 'uikit/components/DropdownMenu/types'
import { ContextApi } from 'contexts/Localization/types'
import { ChainId } from 'sdk'

export type ConfigMenuItemType = MenuItemsType & { hideSubNav?: boolean }
export type ConfigMenuItemsType = {
    [ChainId.MAINNET]: ConfigMenuItemType[]
    [ChainId.TESTNET]: ConfigMenuItemType[]
    [ChainId.RSK_MAINNET]: ConfigMenuItemType[]
    [ChainId.RSK_TESTNET]: ConfigMenuItemType[]
    [ChainId.BSC_MAINNET]: ConfigMenuItemType[]
    [ChainId.BSC_TESTNET]: ConfigMenuItemType[]
    [ChainId.OKC_MAINNET]: ConfigMenuItemType[]
}

const config: (t: ContextApi['t']) => ConfigMenuItemsType = (t) => {
    return {
        [ChainId.MAINNET]: [
            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
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
                ],
            },
            {
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
        ],
        [ChainId.TESTNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
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
                ],
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
        [ChainId.RSK_MAINNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
        [ChainId.RSK_TESTNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
        [ChainId.BSC_MAINNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
        [ChainId.BSC_TESTNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Refer'),
                href: '/refer',
                icon: 'Referals',
                showItemsOnMobile: false,
            },
            {
                label: t('Voting'),
                href: '/voting',
                icon: 'Vote1',
                showItemsOnMobile: false,
            },
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
        [ChainId.OKC_MAINNET]: [

            {
                label: t('Trade'),
                icon: 'Swap',
                href: '/swap',
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
            {
                label: t('Bridge'),
                icon: 'Bridge',
                href: 'https://app.multichain.org/#/router',
                type: DropdownMenuItemType.EXTERNAL_LINK,
                items: [
                    {
                        label: t('HELIX'),
                        href: 'https://app.multichain.org/#/router',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: t('Geobots'),
                        href: 'https://nexus.helix.finance/',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    }
                ],
            },
            {
                label: '',
                href: '',
                icon: 'More',
                hideSubNav: true,
                items: [
                    {
                        label: 'Docs',
                        href: 'https://geometry.gitbook.io/helix',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                    {
                        label: 'Blog',
                        href: 'https://medium.com/helixgeometry',
                        type: DropdownMenuItemType.EXTERNAL_LINK,
                    },
                ],
            },
        ],
    }

}

export default config
