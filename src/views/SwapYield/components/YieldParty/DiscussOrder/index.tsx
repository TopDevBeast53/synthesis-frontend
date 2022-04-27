
import React from "react";
import { useTheme } from "styled-components";
import { Heading, ModalBody, ModalCloseButton, ModalContainer, ModalHeader, ModalTitle } from "uikit";
import getThemeValue from "uikit/util/getThemeValue";


const DiscussOrder: React.FC<any> = (props) => {
  const theme = useTheme();  
  const bodyPadding = "24px"
  const headerBackground = "transparent"
  const minWidth = "320px"
  const {opponentAddress, onDismiss} = props
  return (
    <ModalContainer minWidth={minWidth} {...props} >
      <ModalHeader background={getThemeValue(`colors.${headerBackground}`, headerBackground)(theme)}>
        <ModalTitle>          
          <Heading>A</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss}/>
      </ModalHeader>
      <ModalBody p={bodyPadding}>
          <div>Test</div>
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