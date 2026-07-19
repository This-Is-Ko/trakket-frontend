import type { WatchedStatus } from "~/types/events";

// ─── Admin Event Update Requests ────────────────────────────────────────────

export interface FootballEventUpdateRequest {
    dateTime: string;
    homeScore?: number | null;
    awayScore?: number | null;
}

export interface MotorsportEventUpdateRequest {
    dateTime: string;
    winner?: string | null;
}

// ─── Admin Event List Types ─────────────────────────────────────────────────

export interface CompetitionInfo {
    displayName: string;
    gender: string;
    name: string;
    logoUrl: string;
}

export interface AdminFootballEvent {
    id: number;
    dateTime: string;
    competition: CompetitionInfo;
    round: number | null;
    location: string | null;
    status: string;
    title: string;
    subtitle: string | null;
    homeTeamName: string;
    homeTeamLogoUrl: string | null;
    homeScore: number | null;
    awayTeamName: string;
    awayTeamLogoUrl: string | null;
    awayScore: number | null;
}

export interface AdminMotorsportEvent {
    id: number;
    dateTime: string;
    competition: CompetitionInfo;
    round: number | null;
    location: string | null;
    status: string;
    title: string;
    subtitle: string | null;
    raceName: string;
    circuitName: string | null;
    winner: string | null;
    flagUrl: string | null;
}

export interface AdminPaginatedResponse<T> {
    events: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    last: boolean;
}
