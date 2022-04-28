
import Select from 'components/Select/Select';
import React, {useState} from "react";
import styled, { useTheme } from 'styled-components';
import {
    BalanceInput, Button, Heading, ModalBody, ModalCloseButton,
    ModalContainer, ModalHeader, ModalTitle, Text
} from "uikit";
import getThemeValue from "uikit/util/getThemeValue";

const ReceivedOffer = styled.div`
  background-color: #7f8289;  
  border-radius: 1em;
  border: solid 1px #dde0e9;
  float:left;  
  padding 0.3em 1em;
`
const SentOffer = styled.div`
background-color: #7f8289;
border-radius: 1em;
border: solid 1px #dde0e9;
float:right;
margin-right:1em;
padding 0.3em 1em;
`
const OfferWrap = styled.div`
margin-bottom: 1em;
`
const Content = styled.div`
display: flex;
border-bottom: 1px solid white;
flex-direction: column;
max-height: 50vh;
overflow:auto
`
const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme(); 
   
  const bodyPadding = "24px"
  const headerBackground = "transparent"
  const minWidth = "320px"
  const {opponentAddress, onDismiss} = props

  const [yAmount, setYAmount]=useState(0.0)
  const [durationIndex, setDurationIndex]=useState(0)
  
  const handleYAmountChange = (input) => {
    setYAmount(input)
  }
  const handleOptionChange = (option) => {
    setDurationIndex(option.value)
  }
  const durationOptions=[{
      label:"1 day",
      value:"1"
    },
    {
      label:"2 day",
      value:"2"
    },
    {
      label:"3 day",
      value:"3"
    }    
  ]

  return (
    <ModalContainer minWidth={minWidth} {...props} >
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>          
          <Heading>A</Heading>         
          
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
              <Button width="100%">Send</Button>            
              
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