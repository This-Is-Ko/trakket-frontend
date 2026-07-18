import {createApi} from "~/services/api";

// Competition info returned by the API (serialized from enum with @JsonFormat(Shape.OBJECT))
export interface CompetitionInfo {
    name: string;
    displayName: string;
    gender?: string | null;
    logoUrl?: string | null;
}

// Football
export interface FootballMatchDetails {
    id: number;
    dateTime: string;
    competition: CompetitionInfo;
    round: number;
    location: string | null;
    status: string;
    externalLink: string | null;
    title: string;
    subtitle: string;
    homeTeamId: number;
    homeTeamName: string;
    homeTeamLogoUrl: string | null;
    homeScore: number | null;
    awayTeamId: number;
    awayTeamName: string;
    awayTeamLogoUrl: string | null;
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
    competition: CompetitionInfo;
    round: number;
    location: string | null;
    status: string;
    externalLink: string | null;
    title: string;
    subtitle: string;
    raceName: string;
    circuitName: string;
    winner: string;
    flagUrl: string | null;
}

export interface RecentEventMotorsport {
    details: MotorsportMatchDetails;
    status: string;
}

// Combined recent event (for cross-sport timeline)
export interface CombinedRecentEvent {
    sport: 'football' | 'motorsport';
    dateTime: string;
    title: string;
    competitionName: string;
    status: string;
    details: FootballMatchDetails | MotorsportMatchDetails;
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
    teamSeasonCoverage: Record<string, Record<string, number>>;
}

export interface MotorsportStatistics {
    watchStatusDistribution: Record<string, number>;
    watchedEventsPerCompetition: Record<string, number>;
    recentEvents: RecentEventMotorsport[];
    motorsportSeasonCoverage: Record<string, Record<string, number>>;
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

// ─── Competition name mapping ────────────────────────────────────────────

export const footballCompetitionDisplayNames: Record<string, string> = {
    ENGLISH_PREMIER_LEAGUE: "English Premier League",
    FA_CUP: "FA Cup",
    EFL_CUP: "EFL Cup",
    UEFA_CHAMPIONS_LEAGUE: "UEFA Champions league",
    UEFA_EUROPA_LEAGUE: "UEFA Europa league",
    LA_LIGA: "La Liga",
    SERIE_A: "Serie A",
    BUNDESLIGA: "Bundesliga",
    INTERNATIONAL_FRIENDLY_GAMES_MEN: "International Friendly Games M",
    EURO_MEN: "Euro M",
    WORLD_CUP_MEN: "World Cup M",
    ENGLISH_WOMENS_SUPER_LEAGUE: "English Women's Super League",
    WOMENS_FA_CUP: "Women's FA Cup",
    UEFA_WOMENS_CHAMPIONS_LEAGUE: "UEFA Women's Champions league",
    NATIONAL_WOMENS_SOCCER_LEAGUE: "National Women's Soccer League",
    AFC_WOMENS_ASIAN_CUP: "AFC Women's Asian Cup",
    INTERNATIONAL_FRIENDLY_GAMES_WOMEN: "International Friendly Games F",
    EURO_WOMEN: "Euro F",
    UEFA_WOMENS_NATIONS_LEAGUE: "UEFA Women's Nations League",
    WORLD_CUP_WOMEN: "World Cup F",
};

export const motorsportCompetitionDisplayNames: Record<string, string> = {
    FORMULA_ONE: "Formula One",
    WORLD_ENDURANCE_CHAMPIONSHIP: "World Endurance Championship",
    FORMULA_E: "Formula E",
    MOTOGP: "MotoGP",
};

export function competitionEnumToDisplayName(enumName: string): string {
    return footballCompetitionDisplayNames[enumName]
        ?? motorsportCompetitionDisplayNames[enumName]
        ?? formatEnumToString(enumName);
}

// ─── Derived statistics helpers ──────────────────────────────────────────

/**
 * Sum all values in a Record<string, number>.
 */
export function sumValues(record: Record<string, number>): number {
    return Object.values(record).reduce((sum, v) => sum + v, 0);
}

/**
 * Get the key with the highest value.
 */
export function maxKey(record: Record<string, number>): string | null {
    let best: string | null = null;
    let bestVal = -1;
    for (const [k, v] of Object.entries(record)) {
        if (v > bestVal) {
            bestVal = v;
            best = k;
        }
    }
    return best;
}

/**
 * Merge recent football and motorsport events into a single
 * cross-sport timeline, sorted by dateTime descending.
 */
export function mergeRecentEvents(
    football: RecentEventFootball[],
    motorsport: RecentEventMotorsport[],
): CombinedRecentEvent[] {
    const combined: CombinedRecentEvent[] = [
        ...football.map((e) => ({
            sport: 'football' as const,
            dateTime: e.details.dateTime,
            title: e.details.title,
            competitionName:
                typeof e.details.competition === 'object' && e.details.competition !== null
                    ? (e.details.competition as CompetitionInfo).displayName
                    : String(e.details.competition),
            status: e.status,
            details: e.details,
        })),
        ...motorsport.map((e) => ({
            sport: 'motorsport' as const,
            dateTime: e.details.dateTime,
            title: e.details.raceName || e.details.title,
            competitionName:
                typeof e.details.competition === 'object' && e.details.competition !== null
                    ? (e.details.competition as CompetitionInfo).displayName
                    : String(e.details.competition),
            status: e.status,
            details: e.details,
        })),
    ];

    combined.sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
    );

    return combined.slice(0, 5);
}
