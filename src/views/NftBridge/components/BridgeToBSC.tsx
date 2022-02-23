import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Heading, Button, Card, Text, Grid, ButtonMenu, ButtonMenuItem, NotificationDot } from 'uikit'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import styled from 'styled-components'
import { logError } from 'utils/sentry'

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
