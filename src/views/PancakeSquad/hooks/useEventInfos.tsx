import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { usePancakeSquadContract } from 'hooks/useContract'
import { BigNumber } from 'ethers'
import nftSaleAbi from 'config/abi/nftSale.json'
import { useMulticallv2 } from 'hooks/useMulticall'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const useEventInfos = ({ refreshCounter, setCallback }) => {
    const { chainId } = useActiveWeb3React()
  const pancakeSquadContract = usePancakeSquadContract()
  const multicallv2 = useMulticallv2()
  useEffect(() => {
    const fetchEventInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress(chainId)

        const calls = [
          'maxSupply',
          'maxPerAddress',
          'pricePerTicket',
          'maxPerTransaction',
          'totalTicketsDistributed',
          'currentStatus',
          'startTimestamp',
        ].map((method) => ({
          address: nftSaleAddress,
          name: method,
        }))

        const [
          [currentMaxSupply],
          [currentMaxPerAddress],
          [currentPricePerTicket],
          [currentMaxPerTransaction],
          [currentTotalTicketsDistributed],
          [currentSaleStatus],
          [currentStartTimestamp],
        ] = await multicallv2(nftSaleAbi, calls)

        const currentTotalSupplyMinted = await pancakeSquadContract.totalSupply()

        setCallback({
          maxSupply: currentMaxSupply.toNumber(),
          maxPerAddress: currentMaxPerAddress.toNumber(),
          pricePerTicket: BigNumber.from(currentPricePerTicket),
          maxPerTransaction: currentMaxPerTransaction.toNumber(),
          totalTicketsDistributed: currentTotalTicketsDistributed.toNumber(),
          saleStatus: currentSaleStatus,
          startTimestamp: Number(currentStartTimestamp.toString().padEnd(13, '0')),
          totalSupplyMinted: currentTotalSupplyMinted.toNumber(),
        })
      } catch (e) {
        console.error(e)
      }
    }

    if (nftSaleAbi.length > 0) {
      fetchEventInfos()
    }
  }, [multicallv2, pancakeSquadContract, refreshCounter, setCallback, chainId])
}

export default useEventInfos
