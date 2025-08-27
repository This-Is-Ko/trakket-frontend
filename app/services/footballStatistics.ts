import api from "./api";

export async function fetchFootballEventsWithStatus() {
    const res = await api.get("/api/football/statistics");
    const data = res.data ?? {};

    const watchStatusDistribution = Object.entries(data.watchStatusDistribution ?? {}).reduce(
        (acc, [key, value]) => {
            // Convert enum key to Normal Capital Case
            const label = key
                .toLowerCase()
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            if (typeof value === "number") {
                acc[label] = value;
            }
            return acc;
        },
        {} as Record<string, number>
    );

    return {
        recentMatches: data.recentMatches ?? [],
        watchStatusDistribution,
        matchesPerCompetition: data.matchesPerCompetition ?? {}
    }
}