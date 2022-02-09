import React from "react";
import styled, { keyframes } from "styled-components";
import AuraIcon from "./AuraIcon";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  position: relative;
`;

const RotatingAuraIcon = styled(AuraIcon)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const Spinner: React.FC<SpinnerProps> = ({ size = 128 }) => {
  return (
    <Container>
      <RotatingAuraIcon width={`${size * 0.5}px`} />
    </Container>
  );
};

export default Spinner;
