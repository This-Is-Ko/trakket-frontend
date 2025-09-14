export type WatchedStatus = "UNWATCHED" | "IN_PERSON" | "LIVE" | "REPLAY" | "HIGHLIGHTS";

export interface MotorsportEventDetails {
    id: number;
    dateTime: string;
    competition: MotorsportCompetition;
    round?: string | null;
    location?: string | null;
    status: "COMPLETED" | "SCHEDULED" | string;
    externalLink?: string | null;
    title: string;
    subtitle?: string | null;
    raceName: string;
    circuitName: string;
    winner?: number | null;
    flagUrl?: string | null;
}

export interface MotorsportEventWrapper {
    details: MotorsportEventDetails;
    status: WatchedStatus;
}

export interface MotorsportCompetition {
    displayName: string;
}