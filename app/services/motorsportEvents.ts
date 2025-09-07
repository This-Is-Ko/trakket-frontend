import type {WatchedStatus} from "~/types/events";
import {createApi} from "~/services/api";

export interface FetchEventsParams {
    competition: string;
    status: string;
    page: number;
    pageSize: number;
    ascending: boolean;
}

export async function fetchMotorsportEventsWithStatus(params: FetchEventsParams) {
    const api = createApi();
    const res = await api.get("/api/motorsport/events/with-status", {
        params,
    });
    const data = res.data ?? {};
    return {
        events: data.events ?? [],
        pageNumber: data.pageNumber ?? 0,
        pageSize: data.pageSize ?? params.pageSize,
        totalElements: data.totalElements ?? 0,
        last: data.last ?? false,
    };
}

export async function updateMotorsportEventWatchStatus(eventId: number, status: WatchedStatus) {
    const api = createApi();
    const { data } = await api.post("/api/motorsport/events/status", {
        eventId,
        status,
    });
    return data;
}