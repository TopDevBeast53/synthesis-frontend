import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Flex } from '../Box'

const StyledAlchemyImage = styled.img`
  width: 160px;
  height: auto;
  cursor: pointer;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 200px;
  }
`
const isBadgeInViewpoint = (bounding) => {
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const PoweredByAlchemy: React.FC = () => {
  const BADGE_ID = 'TUxNjU0MzUxNzMyM'
  const ALCHEMY_URL = `https://alchemyapi.io/?r=badge:${BADGE_ID}`
  const ALCHEMY_ANALYTICS_URL = `https://analytics.alchemyapi.io/analytics`

  const logBadgeClick = useCallback(() => {
    fetch(`${ALCHEMY_ANALYTICS_URL}/badge-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        badge_id: BADGE_ID,
      }),
    })
    window.open(ALCHEMY_URL, '_blank').focus()
  }, [ALCHEMY_URL, BADGE_ID, ALCHEMY_ANALYTICS_URL])

  const logBadgeView = useCallback(() => {
    fetch(`${ALCHEMY_ANALYTICS_URL}/badge-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        badge_id: BADGE_ID,
      }),
    })
  }, [ALCHEMY_ANALYTICS_URL])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const badge = document.getElementById('badge-button')
      if (badge && isBadgeInViewpoint(badge.getBoundingClientRect())) {
        logBadgeView()
        clearInterval(intervalId)
      }
    }, 2000)

    return () => clearInterval(intervalId)
  }, [logBadgeView])

  return (
    <Flex justifyContent={['center', null, 'flex-end']} width="100%" pt={['20px', null, '0']}>
      <StyledAlchemyImage
        onClick={logBadgeClick}
        src="/images/alchemy-transparent.png"
        id="badge-button"
        alt="Alchemy Supercharged"
      />
    </Flex>
  )
}

export default PoweredByAlchemy
