import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import teamsList from 'config/constants/teams'
import { Team } from 'config/constants/types'
import { TeamsById, TeamsState } from '../types'

const teamsById: TeamsById = teamsList.reduce((accum, team) => {
  return {
    ...accum,
    [team.id]: team,
  }
}, {})

const initialState: TeamsState = {
  isInitialized: false,
  isLoading: true,
  data: teamsById,
}

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true
    },
    fetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
    teamFetchSucceeded: (state, action: PayloadAction<Team>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data[action.payload.id] = action.payload
    },
    teamsFetchSucceeded: (state, action: PayloadAction<TeamsById>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data = action.payload
    },
  },
})

// Actions
export const { fetchStart, teamFetchSucceeded, fetchFailed, teamsFetchSucceeded } = teamsSlice.actions


export default teamsSlice.reducer
