import { DurationStructOutput } from "config/abi/types/HelixVault"
import { useHelixVault } from "hooks/useContract"
import React, { FC, useEffect, useState } from "react"
import { getVaultApr } from "utils/apr"
import { logError } from "utils/sentry"
import { Flex } from 'uikit'
import Container from 'components/Layout/Container'
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { useHelixLockVault } from "../hooks/useHelixLockVault"
import AprTable, { Duration } from "./AprTable"

interface AprTableProps {
  tokenPerBlock: number
  totalStakedVault: number
}

const AprTableContainer: FC<AprTableProps> = ({ tokenPerBlock, totalStakedVault }) => {
  const [loading, setLoading] = useState(false)
  const [durations, setDurations] = useState<Duration[]>([])

  const { getDurations } = useHelixLockVault()
  const helixVaultContract = useHelixVault()
  const { chainId } = useActiveWeb3React()

  useEffect(() => {
    load()
    async function load() {
      setLoading(true);
      try {
        const res: DurationStructOutput[] = await helixVaultContract.getDurations()
        const durations_ = res.map((item: DurationStructOutput) => {
          const days = item.duration.toNumber() / 3600 / 24
          return {
            ...item,
            days,
            apr: getVaultApr(totalStakedVault, tokenPerBlock, Number(item.weight.toString()), chainId)
          }
        }, [])

        setDurations(durations_);
      } catch (err) {
        logError(err)
      }
      setLoading(false);
    }
  }, [getDurations, helixVaultContract, totalStakedVault, tokenPerBlock, chainId])

  return (
    <Container>
      <Flex flexDirection='column' alignItems="center" style={{ paddingBottom: '20px' }}>
        <AprTable durations={durations} loading={loading} />
      </Flex>
    </Container>
  )
}

export default AprTableContainer