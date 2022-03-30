import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
  padding: 0;
  width: ${({ scale }) => {
    switch (scale) {
      case "xs": 
        return "24px";
      case "sm":
        return "32px";
      default:
        return "48px";
    }
  }}
`;

export default IconButton;
