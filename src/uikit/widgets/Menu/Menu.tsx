import throttle from 'lodash/throttle'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import BottomNav from '../../components/BottomNav'
import { Box } from '../../components/Box'
import Flex from '../../components/Box/Flex'
import Footer from '../../components/Footer'
import MenuItems from '../../components/MenuItems/MenuItems'
import { SubMenuItems } from '../../components/SubMenuItems'
import { useMatchBreakpoints } from '../../hooks'
import Logo from './components/Logo'
import { MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from './config'
import { NavProps } from './types'
import { MenuContext } from './context'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

// border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-color: #101411;
  transform: translate3d(0, 0, 0);
  padding: 0 10px;
  @media screen and (min-width: 1050px){
    padding: 0 30px;
  }
  @media screen and (min-width: 1250px){
    padding: 0 10%;
  }
  @media screen and (min-width: 1650px){
    padding: 0 15%;
  }  
`

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`

const StyledAuditDiv = styled.div`
padding:"5px 0"; 
border:"1px solid #57E58E"; 
margin:"0 0.5em"; 
font-size:"1em";
&:hover{
  opacity:0.4
}
`

const Menu: React.FC<NavProps> = ({
  linkComponent = 'a',
  userMenu,
  networkSelector,
  banner,
  globalMenu,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const { isTablet, isMobile: ss } = useMatchBreakpoints()
  const isMobile = isTablet || ss
  const [showMenu, setShowMenu] = useState(true)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT

  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT
  const submenuTopMargin = totalTopMenuHeight + 71

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
      const isTopOfPage = currentOffset === 0
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true)
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true)
        } else {
          // Has scroll down
          setShowMenu(false)
        }
      }
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [totalTopMenuHeight])

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')

  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly)
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly)  

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
          {banner && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>}
          <StyledNav>
            <Flex>
              <Logo isDark={isDark} href={homeLink?.href ?? '/'} />
              {!isMobile && <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} ml="30px"/>}
            </Flex>
            
            <Flex alignItems="center" height="100%">
              <StyledAuditDiv>
                <a target="_blank" rel="noreferrer" href="http://security.extropy.io/static/media/HelixFinal.ec539013.pdf" style={{display:"inline-block", color:"#57E58E", width:"110px", textAlign:"center"}} >
                  <span style={{fontSize:"1em"}}>Audited by</span>
                  <br/> 
                  <span style={{fontWeight:"bold",fontSize:"1.05em"}}>Extropy.io</span>
                </a>
                
              </StyledAuditDiv>
              {globalMenu} 
              {networkSelector}
              {userMenu}
            </Flex>
          </StyledNav>
        </FixedContainer>
        {subLinks && (
          <Flex justifyContent="space-around">
            <SubMenuItems items={subLinksWithoutMobile} mt={`${submenuTopMargin}px`} activeItem={activeSubItem} />

            {subLinksMobileOnly?.length > 0 && (
              <SubMenuItems
                items={subLinksMobileOnly}
                mt={`${submenuTopMargin}px`}
                activeItem={activeSubItem}
                isMobileOnly
              />
            )}
          </Flex>
        )}
        <BodyWrapper mt={!subLinks ? `${submenuTopMargin}px` : '0'}>
          <Inner isPushed={false} showMenu={showMenu}>
            {children}
            <Footer
              items={footerLinks}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              cakePriceUsd={cakePriceUsd}
              buyCakeLabel={buyCakeLabel}
              // mb={[`${MOBILE_MENU_HEIGHT}px`, null, '0px']}
            />
          </Inner>
        </BodyWrapper>
        {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />}
      </Wrapper>
    </MenuContext.Provider>
  )
}

export default Menu
