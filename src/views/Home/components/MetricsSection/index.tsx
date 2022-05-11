import React from 'react'
import { Flex } from 'uikit'
import MetricCard from './MetricCard'
import StatCardContent from './StatCardContent'

const Stats = () => {
  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Flex flexDirection={['column', null, null, 'row']}>
        <MetricCard leftRounded>
          <StatCardContent headingText="Beta" bodyText="24-Hr Trade Volume:" />
        </MetricCard>
        <MetricCard>
          <StatCardContent headingText="Beta" bodyText="Total Value Locked:" />
        </MetricCard>
        <MetricCard>
          <StatCardContent headingText="Beta" bodyText="HELIX Marketcap:" />
        </MetricCard>
        <MetricCard rightRounded>
          <StatCardContent headingText="Beta" bodyText="HELIX Rate:" />
        </MetricCard>
      </Flex>
    </Flex>
  )
}

export default Stats
