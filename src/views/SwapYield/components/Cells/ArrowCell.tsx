import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon } from 'uikit/components/Svg'
import { CellContent } from './BaseCell'

const ArrowCell = (props) => {
  const { back } = props
  if (back) {
    return (
      <CellContent>
        <ArrowBackIcon />
      </CellContent>
    )
  }
  return (
    <>
      <CellContent>
        <ArrowForwardIcon />
      </CellContent>
    </>
  )
}
export default ArrowCell
