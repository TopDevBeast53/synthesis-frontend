import React, { useState, useMemo } from 'react'
import { Input } from 'uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

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
    return (<StyledInput type="number" {...props} />)
}
export default NumberInputWithArrow
