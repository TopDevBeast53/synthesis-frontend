// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Skeleton } from 'uikit'
import { BLOCK_TIME, DEFAULT_TOKEN_DECIMAL, HELIX_PER_BLOCK } from 'config'
import { useTranslation } from 'contexts/Localization'
import { TableWrapper, Break } from 'views/Info/components/InfoTables/shared'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFeeMinterContract } from 'hooks/useContract'
import { ethersToBigNumber } from 'utils/bigNumber'
import { getPools } from 'config/constants'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 1fr 0.5fr;
  padding: 0 24px;
`
const BlockTimeTable: React.FC = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const feeMinterContract = useFeeMinterContract()
  const [mintPerBlock, setMintPerBlock] = useState(0)
  const [loading, setLoading] = useState(false)

  const [pool] = useMemo(() => getPools(chainId), [chainId])

  useEffect(() => {
    const getMintPerBlock = async (): Promise<number> => {
      try {
        const _mintPerBlock = await feeMinterContract.totalToMintPerBlock()
        return ethersToBigNumber(_mintPerBlock).div(DEFAULT_TOKEN_DECIMAL).toNumber()
      } catch (error) {
        console.error(error)
        return 0
      }
    }

    const getInfos = async () => {
      setLoading(true)
      const [_mintPerBlock] = await Promise.all([getMintPerBlock()])
      setMintPerBlock(_mintPerBlock)
      setLoading(false)
    }
    getInfos()
  }, [feeMinterContract])

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Config')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Value')}
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase" />
      </ResponsiveGrid>
      <Break />

      <ResponsiveGrid>
        <Text>{t('Block Time')}</Text>
        <Text>{BLOCK_TIME[chainId]}</Text>
        <Text />
      </ResponsiveGrid>
      <Break />

      <ResponsiveGrid>
        <Text>{t('Total Mint Per Block')}</Text>
        {loading ? <Skeleton /> : <Text>{mintPerBlock}</Text>}
        <Text />
      </ResponsiveGrid>
      <Break />

      <ResponsiveGrid>
        <Text>{t('Mint Per Block for Farms')}</Text>
        <Text>{HELIX_PER_BLOCK[chainId]}</Text>
        <Text />
      </ResponsiveGrid>
      <Break />

      <ResponsiveGrid>
        <Text>{t('Mint Per Block for Pools')}</Text>
        <Text>{pool.tokenPerBlock[chainId]}</Text>
        <Text />
      </ResponsiveGrid>
      <Break />
    </TableWrapper>
  )
}

export default BlockTimeTable
