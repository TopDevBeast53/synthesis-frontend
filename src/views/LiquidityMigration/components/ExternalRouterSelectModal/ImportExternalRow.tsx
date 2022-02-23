import React, { CSSProperties } from 'react'
import { Token } from 'sdk'
import { Button, Text, CheckmarkCircleIcon } from 'uikit'
import { AutoRow, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useIsExternalDexWithTokenActive } from 'hooks/Dexes'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  const { t } = useTranslation()

  const isActive = useIsExternalDexWithTokenActive(token)

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size="24px" style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <Text>{token.symbol}</Text>
          <Text color="textDisabled" ml="8px">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </Text>
        </AutoRow>
      </AutoColumn>
      {!isActive ? (
        <Button
          width="fit-content"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}
        >
          {t('Import')}
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">Active</Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
