import {createApi} from "~/services/api";

export interface UpdateStatusRequest {
    eventId: number;
    status: string;
}

export async function updateFootballEventStatus(payload: UpdateStatusRequest) {
    const api = createApi();
    const res = await api.post("/api/football/events/status", payload);
    return res.data;
}
