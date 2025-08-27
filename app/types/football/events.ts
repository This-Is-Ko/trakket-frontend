export interface FootballEventDetails {
    id: number;
    dateTime: string;
    competition: string;
    round?: string | null;
    location?: string | null;
    status: "COMPLETED" | "SCHEDULED" | string;
    externalLink?: string | null;
    title: string;
    subtitle?: string | null;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number | null;
    awayScore?: number | null;
}

export interface FootballEventWrapper {
    details: FootballEventDetails;
    status: WatchedStatus;
}
