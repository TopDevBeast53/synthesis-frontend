import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useChainIdData } from 'state/info/hooks'
import { ChainId } from 'sdk'

const ChainWrapper = styled(Flex)`
  justify-content: center;
  padding: 20px 16px;
  gap: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 20px 40px;
  }
`

const InfoChain = () => {
  const { t } = useTranslation()
  const { chainId, setChainId } = useChainIdData()
  const activeIndex = useMemo(() => {
    switch (chainId) {
      case ChainId.MAINNET:
        return 1
      case ChainId.TESTNET:
        return 2
      default:
        return 0
    }
  }, [chainId])

  const onhandleItemClick = (newIndex: number) => {
    switch (newIndex) {
      case 0:
        setChainId(ChainId.MAINNET)
        break
      case 1:
        setChainId(ChainId.MAINNET)
        break
      case 2:
      default:
        setChainId(ChainId.TESTNET)
        break
    }
  }

  return (
    <ChainWrapper>
      <Box>
        <ButtonMenu activeIndex={activeIndex} onItemClick={onhandleItemClick} scale="sm" variant="subtle">
          <ButtonMenuItem>{t('All')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Ethereum')}</ButtonMenuItem>
          <ButtonMenuItem>{t('BSC')}</ButtonMenuItem>
        </ButtonMenu>
      </Box>
    </ChainWrapper>
  )
}

export default InfoChain
