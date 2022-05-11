import React, { useState, useCallback } from 'react'
import { Flex, Button } from 'uikit'

import { AppBody } from 'components/App'
import { AutoColumn } from 'components/Layout/Column'
import type { ExternalRouterData } from 'config/constants/externalRouters'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'

import { useMigrateLiquidity } from './hooks/useMigrateLiquidity'

import MigrationHeaderContainer from './components/MigrationCardHeader'
import ExternalRouterSelect from './components/ExternalRouterSelect'
import Page from '../Page'

export default function Migrator() {
  const [externalRouter, setExternalRouter] = useState<ExternalRouterData | null>(null)
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const { migrateLiquidity } = useMigrateLiquidity()
  const { toastSuccess, toastError } = useToast()

  const migrateLiquidityCall = useCallback(async () => {
    try {
      setIsButtonClicked(true)
      const receipt = await migrateLiquidity(externalRouter)
      if (receipt?.status) {
        toastSuccess('Success', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      } else {
        toastError('Error', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      }
    } catch (error) {
      toastError('Error', 'Something went wrong. Try again later.')
    } finally {
      setIsButtonClicked(false)
    }
  }, [migrateLiquidity, externalRouter, toastSuccess, toastError])

  return (
    <Page>
      <AppBody>
        <Flex position="relative" padding="24px" flexDirection="column">
          <MigrationHeaderContainer
            title="Migrate Liquidity"
            subtitle="Migrate liquidity pool tokens from other DEXs"
          />
          <AutoColumn style={{ padding: '1rem' }} gap="md">
            <ExternalRouterSelect onExternalRouterSelect={setExternalRouter} externalRouter={externalRouter} />
            <Button onClick={migrateLiquidityCall} disabled={isButtonClicked} style={{ marginBottom: '16px' }}>
              Migrate Liquidity
            </Button>
          </AutoColumn>
        </Flex>
      </AppBody>
    </Page>
  )
}
