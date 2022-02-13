import React, { CSSProperties, useCallback, MutableRefObject } from 'react'
import { Text } from 'uikit'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import type { CurrencyAmount } from 'sdk'

import type { ExternalRouterData } from 'config/constants/externalRouters';

import Column from 'components/Layout/Column'
import CircleLoader from 'components/Loader/CircleLoader'
import { RowBetween, RowFixed } from 'components/Layout/Row';
import { RouterLogo } from 'components/Logo';
import { useTokenBalance } from 'state/wallet/hooks';

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const MenuItem = styled(RowBetween)<{ selected: boolean }>`
    padding: 4px 20px;
    height: 56px;
    display: grid;
    grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
    grid-gap: 8px;
    cursor: pointer;
    :hover {
        background-color: ${({ theme }) => theme.colors.background};
    }
    opacity: ${({ selected }) => (selected ? 0.5 : 1)};
`

interface ExternalRouterRowProps {
    onExternalRouterSelect: (externalRouter: ExternalRouterData) => void
    externalRouter?: ExternalRouterData | null
    rowExternalRouter: ExternalRouterData
    style: CSSProperties
}

interface ExternalRouterListProps {
    height: number
    fixedListRef?: MutableRefObject<FixedSizeList | undefined>
    onExternalRouterSelect: (externalRouter: ExternalRouterData) => void
    externalRouter?: ExternalRouterData | null
    externalRouters: ExternalRouterData[]
}

const Balance: React.FC<{ balance: CurrencyAmount }> = ({ balance }) => (
    <StyledBalanceText title={balance.toExact()}>
       {balance.toSignificant(4)}
    </StyledBalanceText>
)

const ExternalDexRow: React.FC<ExternalRouterRowProps> = ({
    onExternalRouterSelect,
    externalRouter,
    rowExternalRouter,
    style,
}) => {
    const handleSelect = () => onExternalRouterSelect(rowExternalRouter)
    const isSelected = Boolean(externalRouter === rowExternalRouter)

    const { account } = useActiveWeb3React()
    const tokenBalance = useTokenBalance(account ?? undefined, rowExternalRouter.pairToken)
    
    return (
        <MenuItem
            style={style}
            onClick={() => (isSelected ? null : handleSelect())}
            selected={isSelected}
        >
            <RouterLogo 
                routerAddress={rowExternalRouter.pairToken.address} 
                size="24px" 
                style={{ marginRight: '8px' }} 
            />
            <Column>
                <Text bold>
                    {rowExternalRouter.name} 
                </Text>
                <Text color="textSubtle" small ellipsis maxWidth="200px">
                    {rowExternalRouter.pairToken.address}
                </Text>
            </Column>
            <RowFixed style={{ justifySelf: 'flex-end' }}>
                {tokenBalance ? <Balance balance={tokenBalance} /> : account ? <CircleLoader /> : null}
            </RowFixed>
      </MenuItem>
    )
}

const ExternalRouterList: React.FC<ExternalRouterListProps> = ({
    height,
    onExternalRouterSelect,
    externalRouter,
    fixedListRef,
    externalRouters,
}) => {
    const Row = useCallback(
        ({ data, index, style }) => (
            <ExternalDexRow 
                onExternalRouterSelect={onExternalRouterSelect}
                externalRouter={externalRouter}
                rowExternalRouter={data[index]}
                style={style}
            />
        ),
        [
            externalRouter,
            onExternalRouterSelect,
        ],
    )

    return (
        <FixedSizeList
        height={height}
        width="100%"
        ref={fixedListRef as any}
        itemData={externalRouters}
        itemCount={externalRouters.length}
        itemSize={56}
        >
        {Row}
        </FixedSizeList>
    )
}

export default ExternalRouterList;