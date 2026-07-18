import { createApi } from '~/services/api'
import type {
  FavouriteEventsResponse,
  FetchFavouriteEventsParams,
  UserFavourites,
} from '~/types/favourites'
import type { WatchedStatus } from '~/types/events'

/**
 * Fetch events for the user's favourited competitions/teams/championships.
 *
 * Query parameters accepted:
 *   - sports (comma-separated: football,motorsport)
 *   - competitions (comma-separated enum names)
 *   - teamIds (comma-separated numeric IDs)
 *   - eventStatus (SCHEDULED / COMPLETED)
 *   - watchStatus (UNWATCHED / IN_PERSON / LIVE / REPLAY / HIGHLIGHTS)
 *   - page, pageSize
 */
export async function fetchFavouriteEvents(
  params: FetchFavouriteEventsParams,
): Promise<FavouriteEventsResponse> {
  const api = createApi()

  const queryParams: Record<string, string | number | boolean> = {
    page: params.page,
    pageSize: params.pageSize,
  }

  if (params.sports && params.sports.length > 0) {
    queryParams.sports = params.sports.join(',')
  }
  if (params.competitions && params.competitions.length > 0) {
    queryParams.competitions = params.competitions.join(',')
  }
  if (params.teamIds && params.teamIds.length > 0) {
    queryParams.teamIds = params.teamIds.join(',')
  }
  if (params.eventStatus) {
    queryParams.eventStatus = params.eventStatus
  }
  if (params.watchStatus) {
    queryParams.watchStatus = params.watchStatus
  }

  const res = await api.get('/api/favourites/events', { params: queryParams })
  const data = res.data ?? {}

  return {
    events: data.events ?? [],
    pageNumber: data.pageNumber ?? 0,
    pageSize: data.pageSize ?? params.pageSize,
    totalElements: data.totalElements ?? 0,
    last: data.last ?? false,
  }
}

/**
 * Update the watch status of a favourite event.
 * Delegates to the sport-specific endpoint based on the `sport` field.
 */
export async function updateFavouriteEventWatchStatus(
  sport: 'football' | 'motorsport',
  eventId: number,
  status: WatchedStatus,
) {
  const api = createApi()
  const endpoint =
    sport === 'football'
      ? '/api/football/events/status'
      : '/api/motorsport/events/status'

  const { data } = await api.post(endpoint, { eventId, status })
  return data
}

/**
 * Fetch the authenticated user's saved favourites.
 * GET /api/favourites
 */
export async function fetchUserFavourites(): Promise<UserFavourites> {
  const api = createApi()
  const { data } = await api.get('/api/favourites')
  return {
    footballCompetitions: data.footballCompetitions ?? [],
    footballTeams: data.footballTeams ?? [],
    motorsportCompetitions: data.motorsportCompetitions ?? [],
  }
}

/**
 * Add or remove a single favourite for the authenticated user.
 * POST /api/favourites/set
 *
 * Returns the updated full list of favourites.
 */
export async function setFavourite(
  type: 'FOOTBALL_COMPETITION' | 'FOOTBALL_TEAM' | 'MOTORSPORT_COMPETITION',
  value: string,
  favourite: boolean,
): Promise<UserFavourites> {
  const api = createApi()
  const { data } = await api.post('/api/favourites/set', { type, value, favourite })
  return {
    footballCompetitions: data.footballCompetitions ?? [],
    footballTeams: data.footballTeams ?? [],
    motorsportCompetitions: data.motorsportCompetitions ?? [],
  }
}
