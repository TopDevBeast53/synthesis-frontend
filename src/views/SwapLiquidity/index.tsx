import React from 'react'
import { Flex, Heading } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

import PageHeader from 'components/PageHeader'
import Page from '../Page'

const NFTDisplayPanel = styled(Flex)`
  position: relative;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 32px;
`;

export default function SwapLiquidity() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader background='transparent'>
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Swap Liquidity')}
        </Heading>
      </PageHeader>
      <Page>
        <NFTDisplayPanel />
      </Page>
    </>
  )
}
