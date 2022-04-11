import Balance from 'components/Balance'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import React from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { AddIcon, Flex, IconButton, MinusIcon, Skeleton, Text, useModal } from 'uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import StakeModal from '../../VaultCard/Modals/StakeModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {  
  isLoading
  deposit  
  stakedBalance
  updateStake
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ isLoading, deposit,stakedBalance,updateStake }) => {  
  const { t } = useTranslation()  
  const { balance: helixBalance} = useTokenBalance(tokens.helix.address)  
  
  const cakePrice = usePriceHelixBusd()
  const {decimals, symbol} = tokens.helix

  const tokenPrice = getBalanceNumber(cakePrice, decimals) 
  const stakedTokenBalance = getBalanceNumber(stakedBalance, decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(cakePrice),
    decimals,
  )
  
  const [onPresentStake] = useModal(
    <StakeModal
      totalBalance={helixBalance}
      stakedBalance={stakedBalance}
      tokenPrice={tokenPrice}
      stakingToken ={tokens.helix}
      depositId={deposit.id}
      updateStake={updateStake}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      totalBalance={helixBalance}
      stakedBalance={stakedBalance}      
      tokenPrice={tokenPrice}
      stakingToken ={tokens.helix}
      depositId={deposit.id}
      isRemovingStake
      updateStake={updateStake}
    />,
  )  

  if (isLoading) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  
  return (
    <ActionContainer >
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {symbol}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Staked')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance
            lineHeight="1"
            bold
            fontSize="20px"
            decimals={5}
            value={stakedTokenBalance}
          />
          <Balance
            fontSize="12px"
            display="inline"
            color="textSubtle"
            decimals={2}
            value={stakedTokenDollarBalance}
            unit=" USD"
            prefix="~"
          />
        </Flex>
        <IconButtonWrapper>            
          <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton variant="secondary" onClick={onPresentStake}>
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>                
        </IconButtonWrapper>        
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
