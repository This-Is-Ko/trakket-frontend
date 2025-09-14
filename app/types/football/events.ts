import type {WatchedStatus} from "~/types/events";

export interface FootballEventDetails {
    id: number;
    dateTime: string;
    competition: FootballCompetition;
    round?: string | null;
    location?: string | null;
    status: "COMPLETED" | "SCHEDULED" | string;
    externalLink?: string | null;
    title: string;
    subtitle?: string | null;
    homeTeamId: string;
    homeTeamName: string;
    homeTeamLogoUrl?: string | null;
    homeScore?: number | null;
    awayTeamId: string;
    awayTeamName: string;
    awayTeamLogoUrl?: string | null;
    awayScore?: number | null;
}

export interface FootballEventWrapper {
    details: FootballEventDetails;
    status: WatchedStatus;
}

export interface FootballCompetition {
    displayName: string;
    gender: string | null;
}

export interface FootballTeam {
    id: number;
    name: string;
    shortName: string | null;
    country: string | null;
    logoUrl: string | null;
    alternativeNames: string[] | null;
    gender: string | null;
}