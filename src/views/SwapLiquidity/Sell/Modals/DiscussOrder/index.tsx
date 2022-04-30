
import { useHelixYieldSwap } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import React, { useState } from "react";
import { useTheme } from 'styled-components';
import {
  AutoRenewIcon, BalanceInput, Button, Heading, ModalBody, ModalCloseButton,
  ModalContainer, ModalHeader, ModalTitle, Text
} from "uikit";
import getThemeValue from "uikit/util/getThemeValue";


const getEllipsis = (account) => {
  return account ? `${account.substring(0, 5)}...${account.substring(account.length - 5)}` : null;
}

const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme(); 
  const YieldSwapContract = useHelixYieldSwap()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  
  const bodyPadding = "24px"
  const headerBackground = "transparent"
  const minWidth = "320px"
  const {bidData, onSend, onDismiss} = props

  const [yAmount, setYAmount]=useState(bidData?.amount)
  
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleSendClick =() =>{
    setPendingTx(true)       
    YieldSwapContract.setAsk(bidData.swapId, yAmount).then(async (tx)=>{
      await tx.wait()
      toastSuccess('Congratulations!', 'You Updated Amount !!! ')            
      if (onSend) onSend()
      setPendingTx(false)
    }).catch(err=>{
      toastError('Error', err.toString())
      setPendingTx(false)
    })
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
                  onClick={handleSendClick}         
                  width="100%"
                > Send </Button>        
              
              
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