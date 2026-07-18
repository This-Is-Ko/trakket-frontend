export interface LandingEvent {
  id: number
  sportType: 'FOOTBALL' | 'MOTORSPORT'
  competition: string
  competitionLogoUrl: string | null
  title: string
  subtitle: string | null
  dateTime: string
  status: string
  location: string | null
  // Football-specific
  homeTeamName: string | null
  homeTeamLogoUrl: string | null
  homeScore: number | null
  awayTeamName: string | null
  awayTeamLogoUrl: string | null
  awayScore: number | null
  // Motorsport-specific
  raceName: string | null
  circuitName: string | null
  winner: string | null
  flagUrl: string | null
}

export interface LandingEventsResponse {
  events: LandingEvent[]
}
