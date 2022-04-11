import { useWeb3React } from '@web3-react/core'
import Page from 'components/Layout/Page'
import Loading from 'components/Loading'
import PageHeader from 'components/PageHeader'
import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useHelix } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import React, { useCallback, useEffect, useState } from 'react'
import { usePriceHelixBusd } from 'state/farms/hooks'
import { Deposit } from 'state/types'
import styled from 'styled-components'
import { Button, Flex, Heading, useModal } from 'uikit'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { logError } from 'utils/sentry'
import AddRowModal from './components/AddRowModal'
import VaultsTable from './components/VaultsTable/VaultsTable'
import { helixVaultAddress } from './constants'
import { useHelixLockVault } from './hooks/useHelixLockVault'

const TableControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0px;    
    margin-bottom: 0;
    padding-top: 0px;
  }
  `
enum HelixEnabledState {
  UNKNOWN,
  ENABLED,
  DISABLED
}

const Vault: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()  
  const helixContract = useHelix()
  const [helixEnabled, setHelixEnabled] = useState(HelixEnabledState.UNKNOWN)
  const [deposits, setDeposits] = useState([])  
  const [totalStake, setTotalStake] = useState(0) 
  const [refresh, setRefresh] = useState(0)

  const {decimals} = tokens.helix  
  const cakePrice = usePriceHelixBusd()

  const { balance: helixBalance, fetchStatus:balanceFetchStatus} = useTokenBalance(tokens.helix.address)  
  const stakingTokenBalance = balanceFetchStatus===FetchStatus.Fetched? helixBalance : BIG_ZERO  
  
  useEffect(()=>{
      if(!account) return;   
      helixContract.balanceOf(helixVaultAddress).then((value:any)=>{
        setTotalStake(getBalanceNumber(value.toString(), decimals))
      }).catch(err=>{
        logError(err)
      })
      helixContract.allowance(account, helixVaultAddress).then((value)=>{
        if(value.gt(0))
          setHelixEnabled(HelixEnabledState.ENABLED)
        else
          setHelixEnabled(HelixEnabledState.DISABLED)
      }).catch(err=>{
        logError(err)
      })    
  }, [helixContract, account, setHelixEnabled, decimals])
  

  const {getDepositIds, getDepositFromId} = useHelixLockVault();
  
  useEffect(()=>{    
    if(helixEnabled && account){      
      load()
    }
    async function load(){
      
      const idList = await getDepositIds();      
      const promiseList = idList.map((id)=>{return getDepositFromId(id)})
      let results = await Promise.all(promiseList);
      results = results.reduce((prev, item:Deposit)=>{
        if(item.withdrawn === false)
          prev.push(item)
        return prev
      },[])
      setDeposits(results)
    }    
  },[getDepositIds, account, getDepositFromId, helixEnabled, refresh])  

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes? 
    
  const handleAfterAdded=()=>{
    setTimeout(()=>{
      setRefresh(refresh + 1)    
    }, 5000)
    
  }
  const [handleAdd] = useModal(<AddRowModal stakingTokenBalance={stakingTokenBalance} stakingTokenPrice= {getBalanceNumber(cakePrice, decimals )} onAdd={handleAfterAdded}/>)
  const handleEnable = useCallback( async ()=>{
    try{
      await helixContract.approve(helixVaultAddress, ethers.constants.MaxUint256);  
      setHelixEnabled(HelixEnabledState.ENABLED);
    }catch(e){      
      logError(e)
    }    
  },[helixContract])
  const buttonScale ="md";
  return (
    <>
      <PageHeader background='transparent'>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="12px">
              {t('Helix Vaults')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Total staked ')} {totalStake.toFixed(3)}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <TableControls>
          <Flex justifyContent="start" width={1}>
            {
              helixEnabled===HelixEnabledState.ENABLED &&
               <Button onClick={handleAdd} key={buttonScale} variant="secondary" scale={buttonScale} mr="8px"> Add </Button>              
            }
            {
              helixEnabled === HelixEnabledState.DISABLED &&
              <Button onClick={handleEnable} key={buttonScale} variant="secondary" scale={buttonScale} mr="8px"> Enable </Button>
            }
          </Flex>
        </TableControls>        
        {deposits.length === 0 && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}        
        <VaultsTable deposits={deposits} />
      </Page>
    </>
  )
}

export default Vault
