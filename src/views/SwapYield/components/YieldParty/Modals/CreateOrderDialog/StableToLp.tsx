import React, { useState } from 'react';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components'
import { AutoRenewIcon, BalanceInput, Button, ButtonMenu, ButtonMenuItem, Input, Modal, Skeleton, Text } from 'uikit'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import Select from 'components/Select/Select'
import Group from 'views/SwapYield/components/GroupComponent';
import { ModalInput } from 'components/Modal';
import { BIG_ZERO } from 'utils/bigNumber';

const StyledInput = styled(Input)`
  ::-webkit-inner-spin-button {
    -webkit-appearance: auto;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: auto;
    margin: 0;
  }
`
const Flex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`
const getInitialOption = (options)=>{
    if (!options || options.length === 0) return undefined    
    return options[0]
}
export default (props)=>{
    const { t } = useTranslation()
    const {toBuyerTokenOptions, minDuration, maxDuration, handleUAmountChange, uAmount, handleSelectMaxOfToBuyerToken,
        toSellerTokenOptions, yAmount, handleYAmountChange, handleToSellerTokenOptionChange
     } = props
    const [selectedDuration, setSelectedDuration] = useState(1)
    const [selectedToByerTokenOption, setSelectedToByerTokenOption] = useState<any>(getInitialOption(toBuyerTokenOptions))
    const handleToBuyerTokenOptionChange=(option)=>{
        setSelectedToByerTokenOption(option)
    }
    const maxBalanceOfToBuyerToken = BIG_ZERO
    // selectedToByerTokenOption 
    //                                     ? 
    //                                     getBalanceAmount(selectedToByerTokenOption.max) :
    //                                     BIG_ZERO
                                        
    const handleDurationChange = (input) => {
        setSelectedDuration(input.target.value)
    }
    return (
        <>
        <Group style={{ margin: '2em 0' }} title="Send">
            <Flex>
            <Text bold style={{ flex: '3' }}>
                {t('Token')}:
            </Text>
            <Select options={toBuyerTokenOptions} onOptionChange={handleToBuyerTokenOptionChange} style={{ zIndex: '30', flex: '6' }} />
            </Flex>

            <div style={{ marginBottom: '1em' }}>
            {selectedToByerTokenOption ? (
                <ModalInput
                value={uAmount.toString()}
                onSelectMax={handleSelectMaxOfToBuyerToken}
                onChange={handleUAmountChange}
                max={maxBalanceOfToBuyerToken.toString()}
                symbol={selectedToByerTokenOption?.label}
                addLiquidityUrl="#"
                inputTitle={t('Amount')}
                />
            ) : (
                <Skeleton />
            )}
            </div>
            <Flex>
            {/* <Text bold style={{ flex: '3' }}>
                {t('Estimated Price')}:{' '}
            </Text>
            <Text style={{ flex: '3' }} color="primary">
                ~ {getEstimatedPrice(selectedLpPrice, uAmount).toString()}
            </Text> */}
            </Flex>
           
        </Group>
        <Group title="Receive" style={{ marginBottom: '2em' }}>
            <Flex>
            <Text bold style={{ flex: '3' }}>
                {t('LP Token')}:
            </Text>
            <Select style={{ flex: '6' }} options={toSellerTokenOptions} onOptionChange={handleToSellerTokenOptionChange} />
            </Flex>

            <Flex>
            <Text bold style={{ flex: '3' }}>
                {t('Amount')}:
            </Text>
            <BalanceInput style={{ flex: '6' }} value={yAmount} onUserInput={handleYAmountChange}/>
            </Flex>
        </Group>
        <Flex>
                <Text bold style={{ flex: '3 3 120px' }}>
                    {t('Duration (days)')}:
                </Text>
                <StyledInput
                    style={{ flex: '7 7' }}
                    type="number"
                    max={maxDuration}
                    min={minDuration}
                    value={selectedDuration}
                    onChange={handleDurationChange}
                />
            </Flex>
        </>
    )
}
// export default LpToStable;