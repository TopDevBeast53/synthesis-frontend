import { useGetAuraBalance } from 'hooks/useTokenBalance'

const useGetVotingPower = () => {
  const { balance, fetchStatus } = useGetAuraBalance() 
  const auraBalance = balance
  const isLoading = fetchStatus === "FETCHING"
  return { auraBalance, isLoading }
}

export default useGetVotingPower
