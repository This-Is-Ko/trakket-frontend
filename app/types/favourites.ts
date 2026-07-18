import type { WatchedStatus } from '~/types/events'
import type { FootballEventDetails, FootballEventWrapper } from '~/types/football/events'
import type { MotorsportEventDetails, MotorsportEventWrapper } from '~/types/motorsport/events'

export interface UserFavourites {
  footballCompetitions: string[]
  footballTeams: number[]
  motorsportCompetitions: string[]
}

export interface FavouriteEvent {
  sport: 'football' | 'motorsport'
  details: FootballEventDetails | MotorsportEventDetails
  status: WatchedStatus
}

export interface FavouriteEventsResponse {
  events: FavouriteEvent[]
  pageNumber: number
  pageSize: number
  totalElements: number
  last: boolean
}

export interface FetchFavouriteEventsParams {
  sports?: ('football' | 'motorsport')[]
  competitions?: string[]
  teamIds?: number[]
  eventStatus?: string | null
  watchStatus?: string | null
  page: number
  pageSize: number
}
