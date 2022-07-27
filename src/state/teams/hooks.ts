import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import merge from 'lodash/merge'
import teamsList from 'config/constants/teams'
import { Team } from 'config/constants/types'
import { TeamsById } from 'state/types'
import profileABI from 'config/abi/pancakeProfile.json'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { useProfile } from 'hooks/useContract'
import { useMulticallv2 } from 'hooks/useMulticall'
import { State, TeamsState } from '../types'
import { fetchFailed, fetchStart, teamFetchSucceeded, teamsFetchSucceeded } from '.'

export const useTeam = (id: number) => {
    const team: Team = useSelector((state: State) => state.teams.data[id])
    const dispatch = useAppDispatch()
    const fetchTeam = useFetchTeam(id)

    useEffect(() => {
        dispatch(fetchTeam)
    }, [id, dispatch, fetchTeam])

    return team
}

export const useTeams = () => {
    const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
    const dispatch = useAppDispatch()
    const fetchTeams = useFetchTeams()

    useEffect(() => {
        dispatch(fetchTeams)
    }, [dispatch, fetchTeams])

    return { teams: data, isInitialized, isLoading }
}



export const useGetTeam = () => {
    const profileContract = useProfile()
    return useCallback(async (teamId: number): Promise<Team> => {
        try {
            const {
                0: teamName,
                2: numberUsers,
                3: numberPoints,
                4: isJoinable,
            } = await profileContract.getTeamProfile(teamId)
            const staticTeamInfo = teamsList.find((staticTeam) => staticTeam.id === teamId)

            return merge({}, staticTeamInfo, {
                isJoinable,
                name: teamName,
                users: numberUsers.toNumber(),
                points: numberPoints.toNumber(),
            })
        } catch (error) {
            return null
        }
    }, [profileContract])
}

/**
 * Gets on-chain data and merges it with the existing static list of teams
 */
export const useGetTeams = () => {
    const profileContract = useProfile()
    const multicallv2 = useMulticallv2()

    return useCallback(async (): Promise<TeamsById> => {
        try {
            const teamsById = teamsList.reduce((accum, team) => {
                return {
                    ...accum,
                    [team.id]: team,
                }
            }, {})
            const nbTeams = await profileContract.numberTeams()

            const calls = []
            for (let i = 1; i <= nbTeams.toNumber(); i++) {
                calls.push({
                    address: getPancakeProfileAddress(),
                    name: 'getTeamProfile',
                    params: [i],
                })
            }
            const teamData = await multicallv2(profileABI, calls)

            const onChainTeamData = teamData.reduce((accum, team, index) => {
                const { 0: teamName, 2: numberUsers, 3: numberPoints, 4: isJoinable } = team

                return {
                    ...accum,
                    [index + 1]: {
                        name: teamName,
                        users: numberUsers.toNumber(),
                        points: numberPoints.toNumber(),
                        isJoinable,
                    },
                }
            }, {})

            return merge({}, teamsById, onChainTeamData)
        } catch (error) {
            return null
        }
    }, [multicallv2, profileContract])
}


// Thunks
export const useFetchTeam = (teamId: number) => {
    const getTeam = useGetTeam()
    return useCallback(async (dispatch) => {
        try {
            dispatch(fetchStart())
            const team = await getTeam(teamId)
            dispatch(teamFetchSucceeded(team))
        } catch (error) {
            dispatch(fetchFailed())
        }
    }, [getTeam, teamId])
}

export const useFetchTeams = () => {
    const getTeams = useGetTeams()
    return useCallback(async (dispatch) => {
        try {
            dispatch(fetchStart())
            const teams = await getTeams()
            dispatch(teamsFetchSucceeded(teams))
        } catch (error) {
            dispatch(fetchFailed())
        }
    }, [getTeams])
}
