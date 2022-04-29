import React from 'react'
import styled from 'styled-components'
import { Input } from 'uikit'

const NumberInputWithArrow = (props)=>{ 
    
    const StyledInput = styled(Input)`        
        ::-webkit-inner-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }
        ::-webkit-outer-spin-button{
            -webkit-appearance: auto; 
            margin: 0; 
        }   
    `    
    return <StyledInput type="number" {...props} />
}
export default NumberInputWithArrow
