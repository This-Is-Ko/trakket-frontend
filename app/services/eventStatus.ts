// services/eventStatus.ts
import api from "./api";

export interface UpdateStatusRequest {
    eventId: number;
    status: string; // WatchedStatus
}

export async function updateFootballEventStatus(payload: UpdateStatusRequest) {
    const res = await api.post("/api/football/events/status", payload);
    return res.data;
}
