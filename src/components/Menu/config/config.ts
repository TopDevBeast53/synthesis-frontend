import { MenuItemsType } from 'uikit'
import { DropdownMenuItemType } from 'uikit/components/DropdownMenu/types'
import { ContextApi } from 'contexts/Localization/types'
import { ChainId } from 'sdk'

export type ConfigMenuItemType = MenuItemsType & { hideSubNav?: boolean, onlyAdmin?: boolean }
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
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
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
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
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
                label: t('Data'),
                href: '/data',
                icon: 'Chart',
                showItemsOnMobile: false,
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
        ],
    }

}

export default config
