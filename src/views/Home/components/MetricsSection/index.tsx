import React from 'react'
import { Flex } from 'uikit'
import MetricCard from './MetricCard'
import StatCardContent from './StatCardContent'

const Stats = () => {
  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">

      <Flex flexDirection={['column', null, null, 'row']}>
        <MetricCard leftRounded>
          <StatCardContent
            headingText="$54,657,189"
            bodyText="Treasury Balance:"
          />
        </MetricCard>
        <MetricCard>
          <StatCardContent
            headingText="$53,688,979"
            bodyText="Total Locked:"
          />
        </MetricCard>
        <MetricCard>
          <StatCardContent
            headingText="935%"
            bodyText="Current APY:"
          />
        </MetricCard>
        <MetricCard rightRounded>
          <StatCardContent
            headingText="$3.76"
            bodyText="Current GMX Price:"
          />
        </MetricCard>
      </Flex>
    </Flex>
  )
}

export default Stats
