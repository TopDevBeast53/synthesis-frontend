import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 16 16" {...props}>
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle className="cls-1" cx="16" cy="16" r="16" style={{fill:"#627eea"}}/><path className="cls-2" style={{fill:"#fff", fillOpacity:"0.6"}} d="M16.5,4v8.87L24,16.22Z"/><path className="cls-3" style={{fill:"#fff"}} d="M16.5,4,9,16.22l7.5-3.35Z"/><path className="cls-2" style={{fill:"#fff", fillOpacity:"0.6"}} d="M16.5,22v6L24,17.62Z"/><path className="cls-3" style={{fill:"#fff"}} d="M16.5,28V22L9,17.62Z"/><path className="cls-4" style={{fill:"#fff", fillOpacity:"0.2"}} d="M16.5,20.57,24,16.22,16.5,12.87Z"/><path className="cls-2" style={{fill:"#fff", fillOpacity:"0.6"}} d="M9,16.22l7.5,4.35v-7.7Z"/></svg>
    </Svg>
  )
}

export default Icon
