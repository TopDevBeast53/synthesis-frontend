/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LotteryTicket, LotteryStatus } from 'config/constants/types'
import { LotteryState, LotteryRoundGraphEntity, LotteryUserGraphEntity, LotteryResponse } from 'state/types'
import { fetchLottery, getGraphLotteryUser } from './helpers'

interface PublicLotteryData {
    currentLotteryId: string
    maxNumberTicketsPerBuyOrClaim: string
}

const initialState: LotteryState = {
    currentLotteryId: null,
    isTransitioning: false,
    maxNumberTicketsPerBuyOrClaim: null,
    currentRound: {
        isLoading: true,
        lotteryId: null,
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
        userTickets: {
            isLoading: true,
            tickets: [],
        },
    },
    lotteriesData: null,
    userLotteryData: { account: '', totalHelix: '', totalTickets: '', rounds: [] },
}

export const fetchCurrentLottery = createAsyncThunk<LotteryResponse, { currentLotteryId: string }>(
    'lottery/fetchCurrentLottery',
    async ({ currentLotteryId }) => {
        const lotteryInfo = await fetchLottery(currentLotteryId)
        return lotteryInfo
    },
)

export const fetchCurrentLotteryId = createAsyncThunk<PublicLotteryData, { fetchCurrentLotteryIdAndMaxBuy: any }>
    ('lottery/fetchCurrentLotteryId', async ({ fetchCurrentLotteryIdAndMaxBuy }) => {
        const currentIdAndMaxBuy = await fetchCurrentLotteryIdAndMaxBuy()
        return currentIdAndMaxBuy
    })

export const fetchUserTicketsAndLotteries = createAsyncThunk<
    { userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity },
    { account: string; currentLotteryId: string, getUserLotteryData: any }
>('lottery/fetchUserTicketsAndLotteries', async ({ account, currentLotteryId, getUserLotteryData }) => {
    const userLotteriesRes = await getUserLotteryData(account, currentLotteryId)
    const userParticipationInCurrentRound = userLotteriesRes.rounds?.find(
        (round) => round.lotteryId === currentLotteryId,
    )
    const userTickets = userParticipationInCurrentRound?.tickets

    // User has not bought tickets for the current lottery, or there has been an error
    if (!userTickets || userTickets.length === 0) {
        return { userTickets: null, userLotteries: userLotteriesRes }
    }

    return { userTickets, userLotteries: userLotteriesRes }
})

export const fetchPublicLotteries = createAsyncThunk<LotteryRoundGraphEntity[], { currentLotteryId: string, getLotteriesData: any }>(
    'lottery/fetchPublicLotteries',
    async ({ currentLotteryId, getLotteriesData }) => {
        const lotteries = await getLotteriesData(currentLotteryId)
        return lotteries
    },
)

export const fetchUserLotteries = createAsyncThunk<
    LotteryUserGraphEntity,
    { account: string; currentLotteryId: string, getUserLotteryData: any }
>('lottery/fetchUserLotteries', async ({ account, currentLotteryId, getUserLotteryData }) => {
    const userLotteries = await getUserLotteryData(account, currentLotteryId)
    return userLotteries
})

export const fetchAdditionalUserLotteries = createAsyncThunk<
    LotteryUserGraphEntity,
    { account: string; skip?: number }
>('lottery/fetchAdditionalUserLotteries', async ({ account, skip }) => {
    const additionalUserLotteries = await getGraphLotteryUser(account, undefined, skip)
    return additionalUserLotteries
})

export const setLotteryIsTransitioning = createAsyncThunk<{ isTransitioning: boolean }, { isTransitioning: boolean }>(
    `lottery/setIsTransitioning`,
    async ({ isTransitioning }) => {
        return { isTransitioning }
    },
)

export const LotterySlice = createSlice({
    name: 'Lottery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentLottery.fulfilled, (state, action: PayloadAction<LotteryResponse>) => {
            state.currentRound = { ...state.currentRound, ...action.payload }
        })
        builder.addCase(fetchCurrentLotteryId.fulfilled, (state, action: PayloadAction<PublicLotteryData>) => {
            state.currentLotteryId = action.payload.currentLotteryId
            state.maxNumberTicketsPerBuyOrClaim = action.payload.maxNumberTicketsPerBuyOrClaim
        })
        builder.addCase(
            fetchUserTicketsAndLotteries.fulfilled,
            (state, action: PayloadAction<{ userTickets: LotteryTicket[]; userLotteries: LotteryUserGraphEntity }>) => {
                state.currentRound.userTickets.isLoading = false
                state.currentRound.userTickets.tickets = action.payload.userTickets
                state.userLotteryData = action.payload.userLotteries
            },
        )
        builder.addCase(fetchPublicLotteries.fulfilled, (state, action: PayloadAction<LotteryRoundGraphEntity[]>) => {
            state.lotteriesData = action.payload
        })
        builder.addCase(fetchUserLotteries.fulfilled, (state, action: PayloadAction<LotteryUserGraphEntity>) => {
            state.userLotteryData = action.payload
        })
        builder.addCase(
            fetchAdditionalUserLotteries.fulfilled,
            (state, action: PayloadAction<LotteryUserGraphEntity>) => {
                const mergedRounds = [...state.userLotteryData.rounds, ...action.payload.rounds]
                state.userLotteryData.rounds = mergedRounds
            },
        )
        builder.addCase(
            setLotteryIsTransitioning.fulfilled,
            (state, action: PayloadAction<{ isTransitioning: boolean }>) => {
                state.isTransitioning = action.payload.isTransitioning
            },
        )
    },
})

export default LotterySlice.reducer
