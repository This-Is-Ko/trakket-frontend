import { updatePrimaryPalette, updateSurfacePalette } from "@primeuix/themes";
import { computed, ref } from "vue";

const appState = ref({
    primary: "emerald",
    surface: "zinc",
    darkMode: false
});

const primaryColors = ref([
    {
        name: "emerald",
        palette: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
            950: "#022c22"
        }
    }
]);

const surfaces = ref([
    {
        name: "slate",
        palette: {
            0: "#ffffff",
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617"
        }
    },
    {
        name: "gray",
        palette: {
            0: "#ffffff",
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#030712"
        }
    },
    {
        name: "zinc",
        palette: {
            0: "#ffffff",
            50: "#fafafa",
            100: "#f4f4f5",
            200: "#e4e4e7",
            300: "#d4d4d8",
            400: "#a1a1aa",
            500: "#71717a",
            600: "#52525b",
            700: "#3f3f46",
            800: "#27272a",
            900: "#18181b",
            950: "#09090b"
        }
    }
]);

export function useLayout() {
    function setPrimary(value: string) {
        appState.value.primary = value;
    }

    function setSurface(value: string) {
        appState.value.surface = value;
    }

    function toggleDarkMode(): void {
        appState.value.darkMode = !appState.value.darkMode;
        document.documentElement.classList.toggle("p-dark");
    }

    function updateColors(type: "primary" | "surface", colorName: string): void {
        if (type === "primary") {
            setPrimary(colorName);
            const color = primaryColors.value.find((c) => c.name === colorName);
            if (color) updatePrimaryPalette(color.palette);
        } else if (type === "surface") {
            setSurface(colorName);
            const surfaceColor = surfaces.value.find((s) => s.name === colorName);
            if (surfaceColor) updateSurfacePalette(surfaceColor.palette);
        }
    }

    const isDarkMode = computed<boolean>(() => appState.value.darkMode);
    const primary = computed<string>(() => appState.value.primary);
    const surface = computed<string | null>(() => appState.value.surface);

    return {
        primaryColors,
        surfaces,
        isDarkMode,
        primary,
        surface,
        toggleDarkMode,
        setPrimary,
        setSurface,
        updateColors,
    };
}