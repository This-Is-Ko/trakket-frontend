import {createApi} from "~/services/api";

// Football
export interface FootballMatchDetails {
    id: number;
    dateTime: string;
    competition: string;
    round: number;
    location: string | null;
    status: string;
    externalLink: string | null;
    title: string;
    subtitle: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
}

export interface RecentEventFootball {
    details: FootballMatchDetails;
    status: string;
}

export interface FootballTeamStatistics {
    teamId: number;
    teamName: string;
    watchedCount: number;
    watchedPercent: number;
}

// Motorsport
export interface MotorsportMatchDetails {
    id: number;
    dateTime: string;
    competition: string;
    round: number;
    location: string | null;
    status: string;
    externalLink: string | null;
    title: string;
    subtitle: string;
    raceName: string;
    circuitName: string;
    winner: string;
}

export interface RecentEventMotorsport {
    details: MotorsportMatchDetails;
    status: string;
}

// Statistics Per Section
export interface OverallStatistics {
    watchStatusDistribution: Record<string, number>;
    sportsMix: Record<string, number>;
}

export interface FootballStatistics {
    watchStatusDistribution: Record<string, number>;
    perCompetition: Record<string, number>;
    recentEvents: RecentEventFootball[];
    topTeams: FootballTeamStatistics[];
}

export interface MotorsportStatistics {
    watchStatusDistribution: Record<string, number>;
    watchedEventsPerCompetition: Record<string, number>;
    recentEvents: RecentEventMotorsport[];
    motorsportSeasonCoverage: Record<string, number>;
}

// Combined
export interface AllStatistics {
    overall: OverallStatistics;
    football: FootballStatistics;
    motorsport: MotorsportStatistics;
}

// Fetcher
export async function fetchStatistics(): Promise<AllStatistics> {
    const api = createApi();
    const res = await api.get("/api/statistics");
    return res.data as AllStatistics;
}

export function formatEnumToString(status: string) {
    return status
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}