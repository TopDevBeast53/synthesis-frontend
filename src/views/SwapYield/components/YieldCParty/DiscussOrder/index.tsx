import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTheme } from 'styled-components'
import {
  BalanceInput,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text,
} from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useHelixYieldSwap, useERC20 } from 'hooks/useContract'
import getThemeValue from 'uikit/util/getThemeValue'
import { getDecimalAmount } from 'utils/formatBalance'

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React();

  const { toastSuccess, toastError } = useToast()  
  const bodyPadding = '24px'
  const headerBackground = 'transparent'
  const minWidth = '320px'
  const yieldSwapContract = useHelixYieldSwap()
  const { swapId, exToken, approved, onDismiss, bid, onSend } = props
  const exContract = useERC20(exToken)
  const [pendingTx, setPendingTx] = useState(false)
  const [isAllowed, setAllowed] = useState(1)

  const [yAmount, setYAmount] = useState(0.0)

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }

  async function doValidation(){      
      
    try{
      const allowedValue =  await exContract.allowance(account, yieldSwapContract.address)
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

  const handleAsk = async () => {
    console.debug('here', approved)
    setPendingTx(true)

    if (isAllowed === 0){
      const decimals = await exContract.decimals()
      const decimalUAmount = getDecimalAmount(new BigNumber(yAmount), decimals)
      exContract.approve(yieldSwapContract.address, decimalUAmount.toString()).then(res=>{
        setAllowed(yAmount)
        setPendingTx(false)
        console.debug('approved!', res)
      }).catch(err=>{
        toastError('Error', err.toString())
        setPendingTx(false)
      })
      return 
    }
    if(!await doValidation()) return 
    try {
      if(bid){
        await yieldSwapContract.setBid(bid.id, yAmount)
      } else {
        await yieldSwapContract.makeBid(swapId, yAmount)
      }
      if (onSend) onSend()
      setPendingTx(false);      
      toastSuccess(
          `${t('Congratulations')}!`,
          t('You Make Bid !!! '),
      )
    } catch(err) {
      setPendingTx(false); 
      toastError('Error', err.toString())
    }
  }

  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>
          <Heading>A</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p={bodyPadding}>
        <div style={{ marginTop: '1em' }}>
          <div style={{ display: 'flex', marginBottom: '1em', alignItems: 'center' }}>
            <Text style={{ marginRight: '1em' }}>Y Amount</Text>
            <BalanceInput value={yAmount} onUserInput={handleYAmountChange} />
          </div>
          <Button width="100%" onClick={handleAsk}>
          {pendingTx ? isAllowed===0 ? "Approving" :t('Confirming') : isAllowed===0 ? "Approve" : t('Confirm')}
          </Button>
        </div>
      </ModalBody>
    </ModalContainer>
  )
}

export default DiscussOrder
