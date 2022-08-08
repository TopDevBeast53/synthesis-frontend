import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'
import { Box, Flex, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
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
  const { chainId } = useActiveWeb3React()
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
          <ButtonMenuItem as={Link} to={{ pathname: "/data", search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
            {t('Overview')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to={{ pathname: "/data/trading-pools", search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
            {t('Trading Pools')}
          </ButtonMenuItem>
          <ButtonMenuItem as={Link} to={{ pathname: "/data/tokens", search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
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
