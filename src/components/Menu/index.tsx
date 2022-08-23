import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { DropdownMenuItemType, Menu as UikitMenu } from 'uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePriceHelixBusd } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAdmin } from 'views/Admin/hooks/useAdmin'
import config from './config/config'
import UserMenu from './UserMenu'
import NetworkSelector from './NetworkSelector'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceHelixBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname, search } = useLocation()
  const { chainId } = useActiveWeb3React()
  const { isAdmin } = useAdmin()

  const menuConfig = useMemo(() => {
    return config(t)[chainId].filter((menuItem) => {
      if (isAdmin) return true
      return menuItem.onlyAdmin !== true
    })
  }, [chainId, isAdmin, t])

  const activeMenuItem = getActiveMenuItem({ menuConfig, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  return (
    <UikitMenu
      linkComponent={(link) =>
        link.type === DropdownMenuItemType.EXTERNAL_LINK ? (
          <a href={link.href} {...link} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ) : (
          <Link to={{ pathname: link.href, search }} {...link} />
        )
      }
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      networkSelector={<NetworkSelector />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd}
      links={menuConfig}
      subLinks={activeMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={footerLinks(t)}
      footerLings={{}}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy Helix')}
      {...props}
    />
  )
}

export default Menu
