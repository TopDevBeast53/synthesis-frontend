import Balance from 'components/Balance'
import { useHelixYieldSwap } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, ChevronDownIcon, Skeleton, Text, useDelayedUnmount } from 'uikit'
import BaseCell, { CellContent } from './BaseCell'
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

const YieldPartyRow=({data: swapId, onClick})=>{
    const YieldSwapContract = useHelixYieldSwap()
    const { toastSuccess, toastError } = useToast()
    const [swapData, setSwapData] = useState<any>()    
    const [expanded, setExpanded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const shouldRenderDetail = useDelayedUnmount(expanded, 300)    
    
    const {duration } = useMemo(()=>{        
        // const dueDate = moment.unix(swapData?.lockDuration.toNumber()) 
        // const today = moment()    
        const retData = { 
            duration: moment.duration(swapData?.lockDuration.toNumber(), "s") , 
            // isPast: dueDate.isSameOrBefore(today)
        }
        return retData        
    },[swapData])
    const handleOnRowClick = () => {
        setExpanded(!expanded)
        if(onClick) onClick()
    }
    const handleCloseClick = (e) => {
        e.stopPropagation();        
        setPendingTx(true) 
        YieldSwapContract.closeSwap(swapId).then(async (tx)=>{
            await tx.wait()
            toastSuccess("Info", "You closed the Order")
            setPendingTx(false) 
        }).catch(err=>{
            if(err.code === 4001){
                toastError("Error", err.message)    
            }else{
                toastError("Error", err.toString())
            }
            setPendingTx(false) 
        })
    }

    useEffect(()=>{        
        YieldSwapContract.getSwap(swapId).then(swap=>{
            setSwapData(swap)            
        })
    }, [YieldSwapContract, swapId])

    if(!swapData){
        return (
        <>
            <StyledRow >
            <StyledCell>
                    <CellContent>
                        <Text>
                            UAmount
                        </Text>
                        <Skeleton mt="4px"/>
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            YAmount
                        </Text>
                        <Skeleton mt="4px"/>
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            Duration
                        </Text>
                        <Skeleton mt="4px"/>
                    </CellContent>       
                </StyledCell>
                
            </StyledRow>
        </>)
    }     
    if(swapData.isOpen !== true) return null
    return (
        <>
            <StyledRow onClick={handleOnRowClick}>
                <StyledCell>
                    <CellContent>
                        <Text>
                            UAmount
                        </Text>
                        <Balance
                            mt="4px"                
                            color='primary'                        
                            value={swapData.amount.toNumber()}
                            fontSize="14px"
                        />
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            YAmount
                        </Text>
                        <Balance
                            mt="4px"                
                            color='primary'                        
                            value={swapData.ask.toNumber()}
                            fontSize="14px"
                        />
                    </CellContent>
                </StyledCell>
                <StyledCell>
                    <CellContent>
                        <Text>
                            Duration
                        </Text>
                        <Text color="primary" mt="4px">
                            {duration.humanize()}
                        </Text>                    
                    </CellContent>       
                </StyledCell>
                <StyledCell style={{zIndex:10, flex:3}}>
                    <Button 
                        isLoading={pendingTx}    
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                        color="primary" onClick={handleCloseClick} scale="sm" width="100px"> Close </Button>
                </StyledCell>
                <StyledCell>
                    <ArrowIcon color="primary" toggled={expanded} />
                </StyledCell>
                
            </StyledRow>
        
            {shouldRenderDetail && (
                <div style={{padding:"10px 10px", minHeight:"5em"}}>
                    <CandidateTable swap={swapData}/>
                </div>
            )}        
        
        </>
    )
}

export default YieldPartyRow;