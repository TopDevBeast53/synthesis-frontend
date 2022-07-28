import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import {
    LotteryRound, LotteryRoundUserTickets, LotteryResponse, LotteryRoundGraphEntity,
    LotteryUserGraphEntity, UserRound
} from 'state/types'
// import { getLotteryV2Contract } from 'utils/contractHelpers'
import { request, gql } from 'graphql-request'
import { useMemo } from 'react'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'

export const processViewLotterySuccessResponse = (response, lotteryId: string): LotteryResponse => {
    const {
        status,
        startTime,
        endTime,
        priceTicketInHelix,
        discountDivisor,
        treasuryFee,
        firstTicketId,
        lastTicketId,
        amountCollectedInHelix,
        finalNumber,
        helixPerBracket,
        countWinnersPerBracket,
        rewardsBreakdown,
    } = response

    const statusKey = Object.keys(LotteryStatus)[status]
    const serializedHelixPerBracket = helixPerBracket.map((helixInBracket) =>
        ethersToSerializedBigNumber(helixInBracket),
    )
    const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
        ethersToSerializedBigNumber(winnersInBracket),
    )
    const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => ethersToSerializedBigNumber(reward))

    return {
        isLoading: false,
        lotteryId,
        status: LotteryStatus[statusKey],
        startTime: startTime?.toString(),
        endTime: endTime?.toString(),
        priceTicketInHelix: ethersToSerializedBigNumber(priceTicketInHelix),
        discountDivisor: discountDivisor?.toString(),
        treasuryFee: treasuryFee?.toString(),
        firstTicketId: firstTicketId?.toString(),
        lastTicketId: lastTicketId?.toString(),
        amountCollectedInHelix: ethersToSerializedBigNumber(amountCollectedInHelix),
        finalNumber,
        helixPerBracket: serializedHelixPerBracket,
        countWinnersPerBracket: serializedCountWinnersPerBracket,
        rewardsBreakdown: serializedRewardsBreakdown,
    }
}

export const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
    return {
        isLoading: true,
        lotteryId,
        status: LotteryStatus.PENDING,
        startTime: '',
        endTime: '',
        priceTicketInHelix: '',
        discountDivisor: '',
        treasuryFee: '',
        firstTicketId: '',
        lastTicketId: '',
        amountCollectedInHelix: '',
        finalNumber: null,
        helixPerBracket: [],
        countWinnersPerBracket: [],
        rewardsBreakdown: [],
    }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
    try {
        // const lotteryData = await lotteryContract.viewLottery(lotteryId)
        // return processViewLotterySuccessResponse(lotteryData, lotteryId)
        return processViewLotteryErrorResponse(lotteryId)
    } catch (error) {
        return processViewLotteryErrorResponse(lotteryId)
    }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
    const currentIdAsInt = parseInt(currentLotteryId, 10)
    const roundIds = []
    for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
        roundIds.push(currentIdAsInt - i)
    }
    return roundIds.map((roundId) => roundId.toString())
}

export const useProcessLotteryResponse = (
    lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
    const {
        priceTicketInHelix: priceTicketInHelixAsString,
        discountDivisor: discountDivisorAsString,
        amountCollectedInHelix: amountCollectedInHelixAsString,
    } = lotteryData

    const discountDivisor = useMemo(() => {
        return new BigNumber(discountDivisorAsString)
    }, [discountDivisorAsString])

    const priceTicketInHelix = useMemo(() => {
        return new BigNumber(priceTicketInHelixAsString)
    }, [priceTicketInHelixAsString])

    const amountCollectedInHelix = useMemo(() => {
        return new BigNumber(amountCollectedInHelixAsString)
    }, [amountCollectedInHelixAsString])

    return {
        isLoading: lotteryData.isLoading,
        lotteryId: lotteryData.lotteryId,
        userTickets: lotteryData.userTickets,
        status: lotteryData.status,
        startTime: lotteryData.startTime,
        endTime: lotteryData.endTime,
        priceTicketInHelix,
        discountDivisor,
        treasuryFee: lotteryData.treasuryFee,
        firstTicketId: lotteryData.firstTicketId,
        lastTicketId: lotteryData.lastTicketId,
        amountCollectedInHelix,
        finalNumber: lotteryData.finalNumber,
        helixPerBracket: lotteryData.helixPerBracket,
        countWinnersPerBracket: lotteryData.countWinnersPerBracket,
        rewardsBreakdown: lotteryData.rewardsBreakdown,
    }
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
    const claimedTickets = tickets.filter((ticket) => ticket.status)
    return claimedTickets.length > 0
}

export const MAX_LOTTERIES_REQUEST_SIZE = 100
// eslint-disable-next-line camelcase
export type LotteriesWhere = { id_in?: string[] }

export const getGraphLotteries = async (
    first = MAX_LOTTERIES_REQUEST_SIZE,
    skip = 0,
    where: LotteriesWhere = {},
): Promise<LotteryRoundGraphEntity[]> => {
    try {
        const response = await request(
            GRAPH_API_LOTTERY,
            gql`
                query getLotteries($first: Int!, $skip: Int!, $where: Lottery_filter) {
                    lotteries(first: $first, skip: $skip, where: $where, orderDirection: desc, orderBy: block) {
                        id
                        totalUsers
                        totalTickets
                        winningTickets
                        status
                        finalNumber
                        startTime
                        endTime
                        ticketPrice
                    }
                }
            `,
            { skip, first, where },
        )
        return response.lotteries
    } catch (error) {
        console.error(error)
        return []
    }
}

export const applyNodeDataToLotteriesGraphResponse = (
    nodeData: LotteryResponse[],
    graphResponse: LotteryRoundGraphEntity[],
): LotteryRoundGraphEntity[] => {
    //   If no graph response - return node data
    if (graphResponse.length === 0) {
        return nodeData.map((nodeRound) => {
            return {
                endTime: nodeRound.endTime,
                finalNumber: nodeRound.finalNumber.toString(),
                startTime: nodeRound.startTime,
                status: nodeRound.status,
                id: nodeRound.lotteryId.toString(),
                ticketPrice: nodeRound.priceTicketInHelix,
                totalTickets: '',
                totalUsers: '',
                winningTickets: '',
            }
        })
    }

    // Populate all nodeRound data with supplementary graphResponse round data when available
    const nodeRoundsWithGraphData = nodeData.map((nodeRoundData) => {
        const graphRoundData = graphResponse.find(
            (graphResponseRound) => graphResponseRound.id === nodeRoundData.lotteryId,
        )
        return {
            endTime: nodeRoundData.endTime,
            finalNumber: nodeRoundData.finalNumber.toString(),
            startTime: nodeRoundData.startTime,
            status: nodeRoundData.status,
            id: nodeRoundData.lotteryId,
            ticketPrice: graphRoundData?.ticketPrice,
            totalTickets: graphRoundData?.totalTickets,
            totalUsers: graphRoundData?.totalUsers,
            winningTickets: graphRoundData?.winningTickets,
        }
    })

    // Return the rounds with combined node + subgraph data, plus all remaining subgraph rounds.
    const [lastCombinedDataRound] = nodeRoundsWithGraphData.slice(-1)
    const lastCombinedDataRoundIndex = graphResponse
        .map((graphRound) => graphRound?.id)
        .indexOf(lastCombinedDataRound?.id)

    const remainingSubgraphRounds = graphResponse ? graphResponse.splice(lastCombinedDataRoundIndex + 1) : []
    const mergedResponse = [...nodeRoundsWithGraphData, ...remainingSubgraphRounds]
    return mergedResponse
}
export const MAX_USER_LOTTERIES_REQUEST_SIZE = 100

/* eslint-disable camelcase */
type UserLotteriesWhere = { lottery_in?: string[] }

export const applyNodeDataToUserGraphResponse = (
    userNodeData: { roundId: string; userTickets: LotteryTicket[] }[],
    userGraphData: UserRound[],
    lotteryNodeData: LotteryResponse[],
): UserRound[] => {
    //   If no graph rounds response - return node data
    if (userGraphData.length === 0) {
        return lotteryNodeData.map((nodeRound) => {
            const ticketDataForRound = userNodeData.find((roundTickets) => roundTickets.roundId === nodeRound.lotteryId)
            return {
                endTime: nodeRound.endTime,
                status: nodeRound.status,
                lotteryId: nodeRound.lotteryId.toString(),
                claimed: hasRoundBeenClaimed(ticketDataForRound.userTickets),
                totalTickets: `${ticketDataForRound.userTickets.length.toString()}`,
                tickets: ticketDataForRound.userTickets,
            }
        })
    }

    // Return the rounds with combined node + subgraph data, plus all remaining subgraph rounds.
    const nodeRoundsWithGraphData = userNodeData.map((userNodeRound) => {
        const userGraphRound = userGraphData.find(
            (graphResponseRound) => graphResponseRound.lotteryId === userNodeRound.roundId,
        )
        const nodeRoundData = lotteryNodeData.find((nodeRound) => nodeRound.lotteryId === userNodeRound.roundId)
        return {
            endTime: nodeRoundData.endTime,
            status: nodeRoundData.status,
            lotteryId: nodeRoundData.lotteryId.toString(),
            claimed: hasRoundBeenClaimed(userNodeRound.userTickets),
            totalTickets: userGraphRound?.totalTickets || userNodeRound.userTickets.length.toString(),
            tickets: userNodeRound.userTickets,
        }
    })

    // Return the rounds with combined data, plus all remaining subgraph rounds.
    const [lastCombinedDataRound] = nodeRoundsWithGraphData.slice(-1)
    const lastCombinedDataRoundIndex = userGraphData
        .map((graphRound) => graphRound?.lotteryId)
        .indexOf(lastCombinedDataRound?.lotteryId)
    const remainingSubgraphRounds = userGraphData ? userGraphData.splice(lastCombinedDataRoundIndex + 1) : []
    const mergedResponse = [...nodeRoundsWithGraphData, ...remainingSubgraphRounds]
    return mergedResponse
}

export const getGraphLotteryUser = async (
    account: string,
    first = MAX_USER_LOTTERIES_REQUEST_SIZE,
    skip = 0,
    where: UserLotteriesWhere = {},
): Promise<LotteryUserGraphEntity> => {
    let user
    const blankUser = {
        account,
        totalCake: '',
        totalTickets: '',
        rounds: [],
    }

    try {
        const response = await request(
            GRAPH_API_LOTTERY,
            gql`
                query getUserLotteries($account: ID!, $first: Int!, $skip: Int!, $where: Round_filter) {
                    user(id: $account) {
                        id
                        totalTickets
                        totalCake
                        rounds(first: $first, skip: $skip, where: $where, orderDirection: desc, orderBy: block) {
                            id
                            lottery {
                                id
                                endTime
                                status
                            }
                            claimed
                            totalTickets
                        }
                    }
                }
            `,
            { account: account.toLowerCase(), first, skip, where },
        )
        const userRes = response.user

        // If no user returned - return blank user
        if (!userRes) {
            user = blankUser
        } else {
            user = {
                account: userRes.id,
                totalCake: userRes.totalCake,
                totalTickets: userRes.totalTickets,
                rounds: userRes.rounds.map((round) => {
                    return {
                        lotteryId: round?.lottery?.id,
                        endTime: round?.lottery?.endTime,
                        claimed: round?.claimed,
                        totalTickets: round?.totalTickets,
                        status: round?.lottery?.status.toLowerCase(),
                    }
                }),
            }
        }
    } catch (error) {
        console.error(error)
        user = blankUser
    }

    return user
}