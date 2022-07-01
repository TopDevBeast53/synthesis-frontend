import React from 'react'
import styled from 'styled-components'
import { Text, Input, InputProps, Flex } from 'uikit'

interface NumberInputProps {
  symbol: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  inputTitle?: string
  decimals?: number
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 12px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 8px 8px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px 16px 8px 0;
  }
  
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  border: none;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 160px;
    font-size:12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 310px;
    font-size:16px;
  }
`

const NumberInput: React.FC<NumberInputProps> = ({
  symbol,
  onChange,
  value,
  inputTitle,
  placeholder = '0',
  decimals = 18,
}) => {
  return (
    <div style={{ position: 'relative', width: "100%" }}>
      <StyledTokenInput>
        <Flex justifyContent="space-between" pl="16px" pb="8px">
          <Text fontSize="14px">{inputTitle}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder={placeholder ?? '0'}
            value={value}
          />
          <Text>{symbol}</Text>
        </Flex>
      </StyledTokenInput>
    </div>
  )
}

export default NumberInput
