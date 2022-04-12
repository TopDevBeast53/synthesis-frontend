import { useTranslation } from 'contexts/Localization'
import moment from 'moment'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text, useMatchBreakpoints } from 'uikit'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {  
  deposit?
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const WithdrawTimeLeft: React.FC<TotalStakedCellProps> = ({deposit }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const {withdrawTimeLeft, isPast} = useMemo(() => {
    const withdrawDate = moment.unix(deposit?.withdrawTimeStamp) 
    const today = moment()    
    const retData = { 
      withdrawTimeLeft: moment.duration(withdrawDate.diff(today)) , 
      isPast: withdrawDate.isSameOrBefore(today)
    }
    return retData
  }, [deposit])

  const balanceFontSize = isMobile ? "14px" : "16px";
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Withdraw Time Left')}
        </Text>
        {deposit ? (
          <Flex height="20px" alignItems="center" mt={2} >
            <Text fontSize={balanceFontSize} color={isPast ? "primary" : "secondary"}>
              {isPast ? "Withdraw is available" :  withdrawTimeLeft.humanize()}
            </Text>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default WithdrawTimeLeft
