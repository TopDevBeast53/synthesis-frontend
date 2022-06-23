import React from 'react'
import styled from 'styled-components'
import CircleLoader from './Loader/CircleLoader'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Loading = styled.div`
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #ddd;
  border-bottom: 8px solid #ddd;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default () => {
  return (
    <div style={{ display:"flex", position:"relative", justifyContent:"center", alignItems:"center"}}>
      <div style={{ display:"flex", justifyContent:"center", paddingBottom: '8px', paddingRight:"10px" }}>
        <div style={{fontSize:"18px", fontWeight:"bold", color:"white"}}>
          Loading...
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", paddingBottom: '8px' }}>
        <CircleLoader size="30px" />
      </div>
    </div>
  )
}
