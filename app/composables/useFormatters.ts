export function useFormatters() {
    const formatEnumToString = (value?: string): string => {
        if (!value) return "-";
        return String(value)
            .toLowerCase()
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    const formatDate = (date?: string | Date): string => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-AU", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return { formatEnumToString, formatDate };
}