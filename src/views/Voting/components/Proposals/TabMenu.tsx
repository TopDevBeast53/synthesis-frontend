import React, { ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, Radio, Text, VerifiedIcon, CommunityIcon } from 'uikit'
import { ProposalType } from 'state/types'

interface TabMenuProps {
  proposalType: ProposalType
  onTypeChange: (proposalType: ProposalType) => void
}

const StyledFilters = styled(Flex).attrs({ alignItems: 'center' })`
  padding: 16px 8px;
`

const FilterLabel = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-right: 16px;
`

const LabelFlex = styled(Flex)`
  align-items: center;
`

const options = [
  { value: ProposalType.CORE, label: <LabelFlex> <VerifiedIcon color="currentColor" mr="4px" /> Core </LabelFlex> },
  { value: ProposalType.COMMUNITY, label: <LabelFlex> <CommunityIcon color="currentColor" mr="4px" /> Community </LabelFlex>},
  { value: ProposalType.ALL, label: <LabelFlex> All </LabelFlex> },
]

const TabMenu: React.FC<TabMenuProps> = ({ proposalType, onTypeChange }) => {
  return (
    <StyledFilters>
      {options.map(({ value, label }) => {
        const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
          const { value: radioValue } = evt.currentTarget
          onTypeChange(radioValue as ProposalType)
        }

        return (
          <FilterLabel key={value}>
            <LabelFlex>
              <Radio
                scale="sm"
                value={value}
                checked={proposalType === value}
                onChange={handleChange}
              />
              <Text ml="8px">{label}</Text>
            </LabelFlex>
          </FilterLabel>
        )
      })}
    </StyledFilters>
  )
}

export default TabMenu
