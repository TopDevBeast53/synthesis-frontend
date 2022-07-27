import { useEffect } from 'react'
import { getNftSaleAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { usePancakeSquadContract } from 'hooks/useContract'
import nftSaleAbi from 'config/abi/nftSale.json'

const useUserInfos = ({ account, refreshCounter, setCallback }) => {
  const pancakeSquadContract = usePancakeSquadContract()
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const nftSaleAddress = getNftSaleAddress()

        if (account) {
          const calls = [
            'canClaimForGen0',
            'numberTicketsForGen0',
            'numberTicketsUsedForGen0',
            'viewNumberTicketsOfUser',
            'ticketsOfUserBySize',
          ].map((method) => ({
            address: nftSaleAddress,
            name: method,
            params: method === 'ticketsOfUserBySize' ? [account, 0, 600] : [account],
          }))

          const [
            [currentCanClaimForGen0],
            [currentNumberTicketsForGen0],
            [currentNumberTicketsUsedForGen0],
            [currentNumberTicketsOfUser],
            [currentTicketsOfUser],
          ] = await multicallv2(nftSaleAbi, calls)

          const currentNumberTokensOfUser = await pancakeSquadContract.balanceOf(account)

          setCallback({
            canClaimForGen0: currentCanClaimForGen0,
            numberTicketsForGen0: currentNumberTicketsForGen0.toNumber(),
            numberTicketsUsedForGen0: currentNumberTicketsUsedForGen0.toNumber(),
            numberTicketsOfUser: currentNumberTicketsOfUser.toNumber(),
            ticketsOfUser: currentTicketsOfUser,
            numberTokensOfUser: currentNumberTokensOfUser.toNumber(),
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (nftSaleAbi.length > 0) {
      fetchUserInfos()
    }
  }, [account, pancakeSquadContract, refreshCounter, setCallback])
}

export default useUserInfos
