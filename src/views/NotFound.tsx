import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, LogoIcon } from 'uikit'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_IDS_TO_NAMES } from 'config/constants/networks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  return (
    <Page>
      <StyledNotFound>
        <LogoIcon width="64px" mb="8px" />
        <Heading scale="xxl">404</Heading>
        <Text mb="16px">{t('Oops, page not found.')}</Text>
        <Button as={Link} scale="sm" to={{ pathname: "/" , search: `chain=${CHAIN_IDS_TO_NAMES[chainId]}` }}>
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
