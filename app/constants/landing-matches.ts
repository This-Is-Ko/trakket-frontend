export interface MatchData {
  id: string
  competition: {
    name: string
    initials: string
    color: string
  }
  homeTeam: {
    name: string
    initials: string
    color: string
  }
  awayTeam: {
    name: string
    initials: string
    color: string
  }
  homeScore: number
  awayScore: number
  date: string
  sport: string
}

export const leftColumnMatches: MatchData[] = [
  {
    id: '1',
    competition: { name: 'Premier League', initials: 'PL', color: '#37003c' },
    homeTeam: { name: 'Arsenal', initials: 'ARS', color: '#ef0107' },
    awayTeam: { name: 'Chelsea', initials: 'CHE', color: '#034694' },
    homeScore: 3, awayScore: 1, date: '12 Jul 2025',
    sport: 'Football',
  },
  {
    id: '2',
    competition: { name: 'Champions League', initials: 'UCL', color: '#0a1e3d' },
    homeTeam: { name: 'Real Madrid', initials: 'RMA', color: '#febe10' },
    awayTeam: { name: 'Bayern Munich', initials: 'FCB', color: '#dc052d' },
    homeScore: 2, awayScore: 2, date: '8 Jul 2025',
    sport: 'Football',
  },
  {
    id: '3',
    competition: { name: 'Formula 1', initials: 'F1', color: '#e10600' },
    homeTeam: { name: 'British GP', initials: 'GBR', color: '#1e3a8a' },
    awayTeam: { name: 'Silverstone', initials: 'SIL', color: '#4f46e5' },
    homeScore: 1, awayScore: 2, date: '6 Jul 2025',
    sport: 'Motorsport',
  },
  {
    id: '4',
    competition: { name: 'NBA Finals', initials: 'NBA', color: '#1d428a' },
    homeTeam: { name: 'Lakers', initials: 'LAL', color: '#552583' },
    awayTeam: { name: 'Celtics', initials: 'BOS', color: '#007a33' },
    homeScore: 112, awayScore: 106, date: '4 Jul 2025',
    sport: 'Basketball',
  },
  {
    id: '5',
    competition: { name: 'IPL', initials: 'IPL', color: '#004c93' },
    homeTeam: { name: 'Mumbai', initials: 'MI', color: '#004c93' },
    awayTeam: { name: 'Chennai', initials: 'CSK', color: '#f9cd05' },
    homeScore: 186, awayScore: 189, date: '1 Jul 2025',
    sport: 'Cricket',
  },
]

export const rightColumnMatches: MatchData[] = [
  {
    id: '6',
    competition: { name: 'Serie A', initials: 'SA', color: '#003c7e' },
    homeTeam: { name: 'AC Milan', initials: 'ACM', color: '#fb090b' },
    awayTeam: { name: 'Inter Milan', initials: 'INT', color: '#0068a5' },
    homeScore: 1, awayScore: 1, date: '11 Jul 2025',
    sport: 'Football',
  },
  {
    id: '7',
    competition: { name: 'MotoGP', initials: 'MGP', color: '#ff6600' },
    homeTeam: { name: 'Italian GP', initials: 'ITA', color: '#009246' },
    awayTeam: { name: 'Mugello', initials: 'MUG', color: '#ce2b37' },
    homeScore: 1, awayScore: 3, date: '9 Jul 2025',
    sport: 'Motorsport',
  },
  {
    id: '8',
    competition: { name: 'La Liga', initials: 'LL', color: '#ff4b44' },
    homeTeam: { name: 'Barcelona', initials: 'FCB', color: '#a50044' },
    awayTeam: { name: 'Atlético', initials: 'ATM', color: '#cb3524' },
    homeScore: 2, awayScore: 0, date: '7 Jul 2025',
    sport: 'Football',
  },
  {
    id: '9',
    competition: { name: 'Wimbledon', initials: 'WIM', color: '#004225' },
    homeTeam: { name: 'Alcaraz', initials: 'ALC', color: '#c5a84b' },
    awayTeam: { name: 'Djokovic', initials: 'DJO', color: '#1a365d' },
    homeScore: 3, awayScore: 2, date: '5 Jul 2025',
    sport: 'Tennis',
  },
  {
    id: '10',
    competition: { name: 'Six Nations', initials: '6N', color: '#0b3d2e' },
    homeTeam: { name: 'Ireland', initials: 'IRE', color: '#169b62' },
    awayTeam: { name: 'England', initials: 'ENG', color: '#cf142b' },
    homeScore: 29, awayScore: 16, date: '2 Jul 2025',
    sport: 'Rugby',
  },
]
