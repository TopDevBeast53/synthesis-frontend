import { BoxProps } from '../Box'
import { DropdownMenuItems, DropdownMenuItemType } from '../DropdownMenu/types'

export type MenuItemsType = {
    label: string
    href: string
    icon?: string
    items?: DropdownMenuItems[]
    showOnMobile?: boolean
    mobileLabel?:string
    type?: DropdownMenuItemType
    showItemsOnMobile?: boolean
}

export interface MenuItemsProps extends BoxProps {
    items: MenuItemsType[]
    activeItem?: string
    activeSubItem?: string
}
