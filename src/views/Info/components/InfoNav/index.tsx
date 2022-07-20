import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'
import { Box, Flex, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Search from 'views/Info/components/InfoSearch'

const NavWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  justify-content: space-between;
  padding: 20px 16px;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
    flex-direction: row;
  }
`

const InfoNav = () => {
  const { t } = useTranslation()
  const isPools = useRouteMatch(['/data/trading-pools', '/data/trading-pool', '/data/pair'])
  const isTokens = useRouteMatch(['/data/tokens', '/data/token'])
  let activeIndex = 0
  if (isPools) {
    activeIndex = 1
  }
  if (isTokens) {
    activeIndex = 2
  }
  return (
    <NavWrapper>
      <Box>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
          <ButtonMenuItem as={Link} to="/data">
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/data/trading-pools">
            {t('Trading Pools')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to="/data/tokens">
            {t('Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Box>
      <Box width={['100%', '100%', '250px']}>
        <Search />
      </Box>
    </NavWrapper>
  )
}

export default InfoNav
