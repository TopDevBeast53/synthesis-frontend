import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 12px;
  max-width: 468px;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
