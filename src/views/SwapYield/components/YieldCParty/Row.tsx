import React, { useState, useMemo } from 'react'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { AutoRenewIcon, Text, Button, useModal, ChevronDownIcon, useDelayedUnmount } from 'uikit'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { useHelixYieldSwap } from 'hooks/useContract'
import moment from 'moment'
import BaseCell, { CellContent } from './BaseCell'
import DiscussOrder from './DiscussOrder'
import { SwapState } from '../../types'
import CandidateTable from './CandidateTable'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`
const StyledCell = styled(BaseCell)`
  flex: 4.5;
  padding-left:32px;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
  }
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const YieldCPartyRow=({data, state})=>{
    const { t } = useTranslation()
    const {amount, ask, id, exToken, lockDuration, approved, bids} = data
    const duration = moment.duration(lockDuration.toNumber(), "s")
    const yieldSwapContract = useHelixYieldSwap();
    
    const { toastSuccess, toastError } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)    

    const [showModal] = useModal(<DiscussOrder swapId={id} exToken={exToken} approved={approved}/>,false)

    const handleExpand = () => {
        setExpanded(!expanded)
    }

    const handleAcceptAsk = async () => {
        setPendingTx(true)
        try {
            await yieldSwapContract.acceptAsk(id)
            setPendingTx(false);      
            toastSuccess(
                `${t('Congratulations')}!`,
                t('You Added Item !!! '),
            )
            
        } catch(err) {
            toastError('Error', err.toString())
            setPendingTx(false);        
        }
    }

    const handleWithdraw = async () => {
        setPendingTx(true)
        try {
            await yieldSwapContract.withdraw(id)
            setPendingTx(false);      
            toastSuccess(
                `${t('Congratulations')}!`,
                t('You Added Item !!! '),
            )
            
        } catch(err) {
            toastError('Error', err.toString())
            setPendingTx(false);        
        }
    }

    return (
        <>
            <StyledRow>
                <StyledCell>
                    <CellContent>
                        <Text>
                            YAmount
                        </Text>
                        <Balance
                            mt="4px"                
                            color='primary'                        
                            value={amount.toNumber()}
                            fontSize="14px"
                        />
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            DAmount
                        </Text>
                        <Balance
                            mt="4px"                
                            color='primary'                        
                            value={ask.toNumber()}
                            fontSize="14px"
                        />
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            Left Time
                        </Text>
                        <Text mt="4px" color='primary'>
                            {duration.humanize()}
                        </Text>
                    </CellContent>
                </StyledCell>
                <StyledCell style={{zIndex:10, flex:3}}>
                    <CellContent>
                    {
                        state === SwapState.All && (
                            <Button variant="secondary" scale="md" mr="8px" onClick={showModal}> Bid </Button>
                        )
                    }
                    {
                        state === SwapState.Applied && (
                            <Button 
                                variant="secondary" scale="md" mr="8px" 
                                isLoading={pendingTx}    
                                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                                onClick={handleAcceptAsk}> Accept Ask </Button>
                        )
                    }

                    {
                        state === SwapState.Pending && (
                            <Button 
                                variant="secondary" scale="md" mr="8px" 
                                isLoading={pendingTx}    
                                endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                                onClick={handleWithdraw}> Collect </Button>
                        )
                    }
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <ArrowIcon color="primary" toggled={expanded} onClick={handleExpand}/>
                </StyledCell>
            </StyledRow>

            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable bids={bids} exToken={exToken} approved={approved}/>
                </div>
            )}   
        </>
    )
}

export default YieldCPartyRow;