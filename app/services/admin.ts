import { createApi } from "~/services/api";
import type {
    FootballEventUpdateRequest,
    MotorsportEventUpdateRequest,
    AdminPaginatedResponse,
    AdminFootballEvent,
    AdminMotorsportEvent,
} from "~/types/admin";

// ─── Admin Stats ──────────────────────────────────────────────────────────

export interface AdminStats {
    totalUsers: number;
    totalFootballEvents: number;
    totalMotorsportEvents: number;
    footballWatchedCount: number;
    motorsportWatchedCount: number;
    footballWatchStatusDistribution: Record<string, number>;
    motorsportWatchStatusDistribution: Record<string, number>;
}

export async function fetchAdminStats(): Promise<AdminStats> {
    const api = createApi();
    const res = await api.get("/api/admin/stats");
    return res.data as AdminStats;
}

// ─── Football Sync ────────────────────────────────────────────────────────

export async function syncFootball(): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/football/sync");
    return res.data as string;
}

export async function syncFootballSofascoreAll(): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/football/sync/sofascore/all");
    return res.data as string;
}

export async function syncFootballSofascoreCompetition(
    competition: string,
    round?: number,
    roundSlug?: string
): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/football/sync/sofascore", {
        params: { competition, round, roundSlug },
    });
    return res.data as string;
}

export async function initFootballCompetition(competition: string): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/football/sync/sofascore/competition/init", {
        params: { competition },
    });
    return res.data as string;
}

// ─── Motorsport Sync ──────────────────────────────────────────────────────

export async function syncMotorsport(): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/motorsport/sync");
    return res.data as string;
}

export async function initMotorsportCompetition(competition?: string): Promise<string> {
    const api = createApi();
    const res = await api.get("/api/motorsport/sync/init", {
        params: competition ? { competition } : {},
    });
    return res.data as string;
}

// ─── Admin Event Management ─────────────────────────────────────────────────

export async function fetchAdminFootballEvents(params: {
    page?: number;
    pageSize?: number;
    competition?: string;
    status?: string;
    ascending?: boolean;
}): Promise<AdminPaginatedResponse<AdminFootballEvent>> {
    const api = createApi();
    const res = await api.get("/api/admin/events/football", { params });
    return res.data as AdminPaginatedResponse<AdminFootballEvent>;
}

export async function fetchAdminMotorsportEvents(params: {
    page?: number;
    pageSize?: number;
    competition?: string;
    status?: string;
    ascending?: boolean;
}): Promise<AdminPaginatedResponse<AdminMotorsportEvent>> {
    const api = createApi();
    const res = await api.get("/api/admin/events/motorsport", { params });
    return res.data as AdminPaginatedResponse<AdminMotorsportEvent>;
}

export async function updateFootballEvent(
    id: number,
    request: FootballEventUpdateRequest
): Promise<any> {
    const api = createApi();
    const res = await api.put(`/api/admin/events/football/${id}`, request);
    return res.data;
}

export async function updateMotorsportEvent(
    id: number,
    request: MotorsportEventUpdateRequest
): Promise<any> {
    const api = createApi();
    const res = await api.put(`/api/admin/events/motorsport/${id}`, request);
    return res.data;
}
