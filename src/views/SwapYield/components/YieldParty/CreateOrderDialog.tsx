import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { useAllTokens } from 'hooks/Tokens'
import { useERC20, useHelixYieldSwap } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import React, { useState } from 'react'
import { Token } from 'sdk'
import { useFarms } from 'state/farms/hooks'
import { DeserializedFarm } from 'state/types'
import styled from 'styled-components'
import {
  AutoRenewIcon, BalanceInput, Button, Input, Modal, Text
} from 'uikit'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount } from 'utils/formatBalance'


const StyledInput = styled(Input)`        
        ::-webkit-inner-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }
        ::-webkit-outer-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }   
    `    

const AddRowModal = (props)=>{
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const {account} = useWeb3React()
  const {onDismiss} = props

  const [uAmount, setUAmount]=useState(5)
  const [yAmount, setYAmount]=useState(20)
  const [duration, setDuration]=useState(1)  
  const [pendingTx, setPendingTx] = useState(false)
  const YieldSwapContract = useHelixYieldSwap()  
  const allTokens = useAllTokens() // All Stable Token
  const { data: farmsLP } = useFarms()
  
  const LPOptions = farmsLP.filter(lp=>lp.pid!==0).map(lp=>(    
  {
    "label": lp.lpSymbol,
    "value": lp      
  }
  ))
  const TokenOptions = Object.keys(allTokens).map((key)=>{
    return {
      "label": allTokens[key].symbol,
      "value": allTokens[key]
    }
  })
  const [selectedLP, setSelectedLP]  = useState<DeserializedFarm>(farmsLP[0])
  const [selectedToken, setSelectedToken] = useState<Token>(TokenOptions[0].value)
  const [isAllowed, setAllowed] = useState(1)
  
  const handleUAmountChange = (input) => {
    setUAmount(input)
  }
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }  
  const handleLPChange = (option) => {
    setSelectedLP(option.value)
  }
  const handleTokenChange = (option) => { setSelectedToken(option.value)}
  const handleDurationChange = (input) => {    
    setDuration(input.target.value)
  }
  const lpAddress = getAddress(selectedLP.lpAddresses)
  const lpContract = useERC20(lpAddress)

  const handleConfirm = async () => {
    if(!selectedToken || ! selectedLP) return 
    setPendingTx(true);   
    async function DoValidation(){      
      
      try{
        const allowedValue =  await lpContract.allowance(account, YieldSwapContract.address)
        if(allowedValue.lte(0))  {
          toastError('Error', "You didn't allow the LPToken to use")
          setAllowed(0)
          setPendingTx(false);        
          return false          
        }

      }catch(err){
        toastError('Error', err.toString())
        setAllowed(0)
        setPendingTx(false);        
        return false
      }
      return true
    }
    if (isAllowed === 0){
      const decimals = await lpContract.decimals()
      const decimalUAmount = getDecimalAmount(new BigNumber(uAmount), decimals)
      lpContract.approve(YieldSwapContract.address, decimalUAmount.toString()).then( async (tx)=>{        
        await tx.wait()
        toastSuccess(
          `${t('Congratulations')}!`,
            t('You Apporved  !!! '),
        )
        setAllowed(uAmount)
        setPendingTx(false)
      }).catch(err=>{
        toastError('Error', err.toString())
        setPendingTx(false)
      })
      return 
    }
    if(!await DoValidation()) return 

    YieldSwapContract.openSwap(selectedToken.address, selectedLP.pid, uAmount, yAmount, 3600 * 24* duration).then(async (tx)=>{
      await tx.wait()
      setPendingTx(false);
      toastSuccess(
          `${t('Congratulations')}!`,
          t('You Added Item !!! '),
      )

    }).catch(err=>{
      setPendingTx(false); 
      toastError('Error', err.toString())

    })
  }

  
  return (
    <Modal
      title={t('Add Item') }
      headerBackground={theme.colors.gradients.cardHeader}    
      onDismiss={onDismiss}
    > 
      
      <Text bold>{t('LP Token')}:</Text>           
      <Select options={LPOptions} onOptionChange={handleLPChange} style={{zIndex:"30"}}/>
      
      <Text bold>{t('LP Token Amount')}:</Text>
      <BalanceInput 
            value={uAmount}
            onUserInput={handleUAmountChange}
      />
      <Text bold>{t('Token')}:</Text>                 
      <Select options={TokenOptions} onOptionChange={handleTokenChange}/>
      
      <Text bold>{t('Y Amount')}:</Text>
      <BalanceInput 
          value={yAmount}
          onUserInput={handleYAmountChange}
      />
      <Text bold>{t('Duration (days)')}:</Text>
      <StyledInput type="number" max={365} min={1} value={duration}  onChange={handleDurationChange}/>
      
      <Button
        isLoading={pendingTx}    
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirm} 
        mt="24px"
      >
        {pendingTx ? isAllowed===0 ? "Approving" :t('Confirming') : isAllowed===0 ? "Approve" : t('Confirm')}
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        Close Window
      </Button>
    </Modal>
  )
}
export default AddRowModal

