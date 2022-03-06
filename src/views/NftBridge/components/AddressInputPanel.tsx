import React, { useCallback } from 'react'
import { Text, Link, Input } from 'uikit'
import { ChainId } from 'sdk'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { AutoColumn } from '../../../components/Layout/Column'
import { RowBetween } from '../../../components/Layout/Row'
import { getSolanaScanLink } from '../../../utils'

export default function AddressInputPanel({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { chainId } = useActiveWeb3React()

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange],
  )

  return (
    <AutoColumn gap="md">
      <RowBetween>
        <Text>
          Destination Solana Address
        </Text>
        {
          value.length === 44 && chainId && (
          <Link external small 
            href={
              getSolanaScanLink(value, chainId === ChainId.MAINNET
              ? 'mainnet' 
              : 'testnet')
            }
          >
            View on SolanaScan
          </Link>
          )
        }
      </RowBetween>
      <Input
        className="recipient-address-input"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder='Solana Address'
        pattern="[^]{44}"
        onChange={handleInput}
        value={value}
      />
    </AutoColumn>
  )
}
