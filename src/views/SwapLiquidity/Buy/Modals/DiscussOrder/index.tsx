
import React, { useState } from "react";
import { useHelixLpSwap, useERC20 } from 'hooks/useContract';
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast';
import { useTranslation } from 'contexts/Localization'
import { useTheme } from 'styled-components';
import {
  AutoRenewIcon, BalanceInput, Button, Heading, ModalBody, ModalCloseButton,
  ModalContainer, ModalHeader, ModalTitle, Text
} from "uikit";
import getThemeValue from "uikit/util/getThemeValue";
import { getDecimalAmount } from 'utils/formatBalance'


const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null;
}

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme(); 
  const { account } = useWeb3React();
  const { t } = useTranslation()
  const LpSwapContract = useHelixLpSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [isAllowed, setAllowed] = useState(1)
  
  const bodyPadding = "24px"
  const headerBackground = "transparent"
  const minWidth = "320px"
  const {bidData, bidId, swapData, onSend, onDismiss} = props
  const exContract = useERC20(swapData?.toSellerToken)

  const [yAmount, setYAmount]=useState(bidData?.amount)
  
  async function doValidation(){      
    try{
      const allowedValue =  await exContract.allowance(account, LpSwapContract.address)

      console.debug('?????', allowedValue.toString())
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

  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleAsk = async () => {
    setPendingTx(true)

    if (isAllowed === 0){
      const decimals = await exContract.decimals()
      const decimalUAmount = getDecimalAmount(new BigNumber(yAmount), decimals)
      try {
        const tx = await exContract.approve(LpSwapContract.address, decimalUAmount.toString());
        await tx.wait()
        setAllowed(yAmount)
        setPendingTx(false)
      } catch (err) {
        toastError('Error', 'Please check your network status or token balance')
        setPendingTx(false)
      }
      return 
    }
    if(!await doValidation()) return 

    try {
      if(bidData){
        const tx = await LpSwapContract.setBid(bidId, yAmount)
        await tx.wait()
      } else {
        const tx = await LpSwapContract.makeBid(swapData?.id, yAmount)
        await tx.wait()
      }
      if (onSend) onSend()
      setPendingTx(false);   
      onDismiss()   
      toastSuccess(
          `${t('Congratulations')}!`,
          t('You Make Bid !!! '),
      )
    } catch(err) {
      setPendingTx(false); 
      toastError('Error', 'Please check your network status or token balance')
    }
  }

  return (
    <ModalContainer minWidth={minWidth} {...props} >
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>          
          <Heading>{getEllipsis(bidData?.bidder)}</Heading>         
        </ModalTitle>        
        <ModalCloseButton onDismiss={onDismiss}/>
      </ModalHeader>
      <ModalBody p={bodyPadding}>         
          <div style={{marginTop:"1em"}}>
              
                <div style={{display:"flex", marginBottom:"1em", alignItems:"center"}}>
                    <Text style={{marginRight:"1em"}} >Y Amount</Text>
                    <BalanceInput 
                            value={yAmount}                            
                            onUserInput={handleYAmountChange}
                        />
                </div>        
                <Button
                  isLoading={pendingTx}    
                  endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}       
                  onClick={handleAsk}         
                  width="100%"
                > {pendingTx ? isAllowed===0 ? "Approving" :t('Confirming') : isAllowed===0 ? "Approve" : t('Confirm')}
                 </Button>        
              
              
          </div>
      </ModalBody>
    </ModalContainer>
  );
};

export default DiscussOrder;

// const DiscussOrder = () => {
//     return (
//         <div style={{ padding: "32px", width: "500px" }}>
//             <Card>
//                 <CardHeader>
//                     <Heading size="xl">Card Header</Heading>
//                 </CardHeader>
//                 <CardBody>Body</CardBody>
//                 <CardFooter>Footer</CardFooter>
//             </Card>
//         </div>
//     )
// }
// export default DiscussOrder