import React from 'react'
import { Skeleton, Text } from 'uikit'
import { CellContent } from './BaseCell'

const DurationCell = (props) => {
  const { duration } = props // moment Duration
  if (!duration) {
    return (
      <CellContent>
        <Skeleton />
        <Skeleton mt="4px" />
      </CellContent>
    )
  }
  return (
    <>
      <CellContent>
        <Text>Duration</Text>
        <Text color="primary" mt="4px">
          {duration.humanize()}
        </Text>
      </CellContent>
    </>
  )
}
export default DurationCell
