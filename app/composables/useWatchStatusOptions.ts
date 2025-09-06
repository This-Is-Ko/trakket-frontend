import type { WatchedStatus } from "~/types/events";

export function useWatchStatusOptions() {
    const watchStatusOptions: { label: string; value: WatchedStatus }[] = [
        { label: "Unwatched", value: "UNWATCHED" },
        { label: "In Person", value: "IN_PERSON" },
        { label: "Live", value: "LIVE" },
        { label: "Replay", value: "REPLAY" },
        { label: "Highlights", value: "HIGHLIGHTS" },
    ];

    return { watchStatusOptions };
}