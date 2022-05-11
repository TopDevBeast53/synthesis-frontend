import React, { ChangeEvent } from 'react'
import { Flex, Radio, Text } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ProposalState } from 'state/types'

interface FiltersProps {
  filterState: ProposalState
  onFilterChange: (filterState: ProposalState) => void
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

const options = [
  { value: ProposalState.ACTIVE, label: 'Active' },
  { value: ProposalState.PENDING, label: 'Soon' },
  { value: ProposalState.CLOSED, label: 'Closed' },
]

const Filters: React.FC<FiltersProps> = ({ filterState, onFilterChange }) => {
  const { t } = useTranslation()

  return (
    <StyledFilters>
      {options.map(({ value, label }) => {
        const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
          const { value: radioValue } = evt.currentTarget
          onFilterChange(radioValue as ProposalState)
        }

        return (
          <FilterLabel key={label}>
            <Radio scale="sm" value={value} checked={filterState === value} onChange={handleChange} />
            <Text ml="8px">{t(label)}</Text>
          </FilterLabel>
        )
      })}
    </StyledFilters>
  )
}

export default Filters
