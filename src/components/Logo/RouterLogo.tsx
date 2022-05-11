import React from 'react'
import styled from 'styled-components'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const getImageUrlFromRouterAddress = (routerAddress: string) => {
  return `/images/routers/${routerAddress}.svg`
}

export default function RouterLogo({
  routerAddress,
  size = '24px',
  style,
}: {
  routerAddress?: string
  size?: string
  style?: React.CSSProperties
}) {
  const srcs: string[] = [getImageUrlFromRouterAddress(routerAddress)]

  return <StyledLogo size={size} srcs={srcs} alt="Router logo" style={style} />
}
