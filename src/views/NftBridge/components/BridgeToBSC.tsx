import React from 'react'
import { Flex, Heading, Button } from 'uikit'


export default function BridgeToBSC() {
  return (
    <Flex position="relative" padding="24px" flexDirection="column">
      <Heading as="h2" mb="14px">
        BridgeToBSC
      </Heading>
      <Button style={{ marginBottom: '10px' }}>
        BridgeFromSolana
      </Button>
      <Button style={{ marginBottom: '10px' }}>
        Claim
      </Button>
    </Flex>
  )
}
