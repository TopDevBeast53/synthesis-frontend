import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ModalInput } from 'components/Modal'
import Select from 'components/Select/Select'
import { Erc20 } from 'config/abi/types'
import { useTranslation } from 'contexts/Localization'
import { ethers } from 'ethers'
import { useERC20s, useHelixLpSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useMemoFarms } from 'state/farms/hooks'
import styled from 'styled-components'
import {
  AutoRenewIcon, BalanceInput, Button, Modal, Skeleton, Text
} from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import Group from 'views/SwapYield/components/GroupComponent'

const Flex = styled.div`
display:flex;
align-items:center;
margin-bottom:0.5em;
`

const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {account} = useWeb3React()
  const {onDismiss} = props

  const [uAmount, setUAmount]=useState("0")
  const [yAmount, setYAmount]=useState("0")

  const [pendingTx, setPendingTx] = useState(false)
  const LpSwapContract = useHelixLpSwap()    
  const { data: farmsLP } = useMemoFarms()
  
  const [LPOptions, setLPOptions] = useState<any>() 
  const [selectedLPOption, setSelectedLPOption] = useState<any>()  
  const maxBalanceOfLP = getBalanceAmount(selectedLPOption?.value.userData.tokenBalance)
  const selectedLpPrice = selectedLPOption? new BigNumber(selectedLPOption?.value.tokenPriceBusd) : BIG_ZERO

  const [selectedLPBuyOption, setSelectedLPBuyOption] = useState<any>()  
  const selectedLpBuyPrice = selectedLPBuyOption? new BigNumber(selectedLPBuyOption?.value.tokenPriceBusd) : BIG_ZERO
  const handleUAmountChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        if (e.currentTarget.value === "")
          setUAmount("0")
        setUAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setUAmount],
  )
  const handleYAmountChange = (input) => {
    if(input === "") setYAmount("0")    
    setYAmount(input)
  }  

  
  const handleLPChange = (option) => {
    setSelectedLPOption(option)    
  }
  const handleBuyOptionChange = (option) => { setSelectedLPBuyOption(option)}
  const [tempLPOptions, lpAddressList] = useMemo(()=>{
    const lpOptions= farmsLP.filter(lp=>lp.pid!==0).map(lp=>    
      (
        {
          label: lp.lpSymbol,
          value: lp,
          allowance:BIG_ZERO,
          contract:undefined
        }
      )
    )
    const addressList =  lpOptions.map((option)=>{
      return getAddress(option.value.lpAddresses)
    })
    return [lpOptions, addressList]
  },[farmsLP])
  
  const lpContracts = useERC20s(lpAddressList)

  const decimalUAmount = getDecimalAmount(new BigNumber(uAmount))
  const decimalYAmount = getDecimalAmount(new BigNumber(yAmount))
  const handleConfirm = async () => {    
    if(!selectedLPBuyOption || ! selectedLPOption) return 
    const selectedLPContract:Erc20 = selectedLPOption.contract
    const selectedLPAllowance = selectedLPOption.allowance
         
    async function DoValidation(){
      if (uAmount === "0" || yAmount === "0"){
        toastError('Error', `Both Token Amount Should be bigger than Zero`)
        return false
      }      
      if (maxBalanceOfLP.lt(uAmount)){
        toastError('Error', `${selectedLPOption.value.lpSymbol} amount is over limit`)
        return false
      }
      return true
    }    
    if (selectedLPAllowance.lte(decimalUAmount)){
      const decimals = await selectedLPContract.decimals()      
      setPendingTx(true); 
      
      selectedLPContract.approve(LpSwapContract.address, ethers.constants.MaxUint256).then( async (tx)=>{        
        await tx.wait()
        toastSuccess(
          `${t('Congratulations')}!`,
            t('You Apporved  !!! '),
        )        
        selectedLPOption.allowance=getDecimalAmount(new BigNumber(Number.POSITIVE_INFINITY), decimals)
        setSelectedLPOption({...selectedLPOption})
        setPendingTx(false)
      }).catch(err=>{
        toastError('Error', err.toString())
        setPendingTx(false)
      })
      return 
    }
    if(!await DoValidation()) return 
    setPendingTx(true);     
    LpSwapContract.openSwap(selectedLPOption.contract.address, selectedLPBuyOption.contract.address, decimalUAmount.toString(), decimalYAmount.toString()).then(async (tx)=>{
      await tx.wait()
      setPendingTx(false);
      toastSuccess(
          `${t('Congratulations')}!`,
          t('You Added Item !!! '),
      )
      if(onDismiss) onDismiss()

    }).catch(err=>{
      setPendingTx(false); 
      toastError('Error', err.toString())

    })
  }

  useEffect(()=>{
    const allowanceContracts = lpContracts.map((lpContract)=>{
      return lpContract.allowance(account, LpSwapContract.address)
    })
    Promise.all(allowanceContracts).then((allowances) => {      
      
      for(let i =0; i< tempLPOptions.length; i ++){
        tempLPOptions[i].allowance = new BigNumber(allowances[i].toString())
        tempLPOptions[i].contract = lpContracts[i]
      }      
      setLPOptions(tempLPOptions)      
      if(!selectedLPOption) setSelectedLPOption(tempLPOptions[0])
      if(!selectedLPBuyOption) setSelectedLPBuyOption(tempLPOptions[1])
    })
  }, [LpSwapContract.address, account, lpContracts, tempLPOptions, selectedLPOption, selectedLPBuyOption])

  const handleSelectMaxOfLPToken = useCallback(() => {
    setUAmount(maxBalanceOfLP.toString())
  }, [maxBalanceOfLP, setUAmount])
  if (!LPOptions) return null
  return (
    <Modal
      title={t('Add Item') }
      headerBackground={theme.colors.gradients.cardHeader}    
      onDismiss={onDismiss}
    >
    <Group style={{marginBottom:"1em"}}>
      <Flex>
        <Text bold style={{flex:"3"}}>{t('LP Token')}:</Text>           
        <Select options={LPOptions} onOptionChange={handleLPChange} style={{zIndex:"30", flex:"6"}}/>
      </Flex>
      
      <div style={{marginBottom:"1em"}}>
        {selectedLPOption? 
          <ModalInput
            value={uAmount.toString()}
            onSelectMax={handleSelectMaxOfLPToken}
            onChange={handleUAmountChange}
            max={maxBalanceOfLP.toString()}
            symbol={selectedLPOption?.label}
            addLiquidityUrl="#"
            inputTitle={t('Amount')}
          />
          :
          <Skeleton/>
        }
      </div>
      <Flex>
        <Text bold style={{flex:"3"}}>{t('Estimated Price')}:  </Text>
        <Text style={{flex:"3"}} color="primary">~ {selectedLpPrice?.times(uAmount).toString()}  </Text>
      </Flex>      
    </Group>
    <Group>
      <Flex>
        <Text bold style={{flex:"3"}}>{t('Exchange')}:</Text>             
        <Select options={LPOptions} onOptionChange={handleBuyOptionChange} style={{zIndex:"30", flex:"6"}}/>    
        
      </Flex>

      <Flex>
        <Text bold style={{flex:"3"}}>{t('Amount')}:</Text>
        <BalanceInput 
            style={{flex:"6"}}
            value={yAmount}
            onUserInput={handleYAmountChange}
        />
      </Flex>
      <Flex>
        <Text bold style={{flex:"3"}}>{t('Estimated Price')}:  </Text>
        <Text style={{flex:"3"}} color="primary">~ {selectedLpBuyPrice?.times(yAmount).toString()}  </Text>
      </Flex> 
    </Group>
      <Button
        isLoading={pendingTx}    
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirm} 
        mt="24px"
      >
        {pendingTx ? selectedLPOption?.allowance.lte(decimalUAmount) ? "Approving" :t('Confirming') : selectedLPOption?.allowance.lte(decimalUAmount)? "Approve" : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        Close Window
      </Button>
    </Modal>
  )
}
export default AddRowModal

