import { useWeb3React } from '@web3-react/core'
import Balance from 'components/Balance'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import React from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { Button, Flex, Heading, Skeleton, Text } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import { useHelixLockVault } from '../../../hooks/useHelixLockVault'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface HarvestActionProps {  
  earnings
  isLoading
  deposit
  updateEarnings?
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({  
  isLoading,
  earnings,
  deposit,
  updateEarnings
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { claimReward } = useHelixLockVault()
  const { toastError, toastSuccess } = useToast()
  
  const cakePrice = usePriceHelixBusd()    
  const {decimals, symbol} = tokens.helix
  
  const hasEarnings = !isLoading && earnings.gt(0)
  const earningTokenBalance = getBalanceNumber(earnings, decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(cakePrice), decimals)
  
  const onPresentCollect = async () => {
    try {
      const receipt = await claimReward(deposit?.id)
      if (receipt.status){          
        toastSuccess(t('Success'), t('Collected'))
        updateEarnings(0)
      } else {
        toastError(t('Error'), t('Maybe show transaction hash so they could go there and check the problem.'))
      }
    } catch (e) {
      logError(e)
      toastError(t('Error'), t('Please try again.'))
    }    
  }

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
          <Button disabled>{t('Collect')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (isLoading) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                {cakePrice.gt(0) && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Button disabled={!hasEarnings} onClick={onPresentCollect}>
          {t('Collect')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction