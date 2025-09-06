export function useWatchStatusIcon() {
    const getWatchStatusIcon = (status: string): string | null => {
        switch (status) {
            case 'IN_PERSON':
                return 'pi pi-ticket';
            case 'LIVE':
                return 'pi pi-clock';
            case 'HIGHLIGHTS':
                return 'pi pi-video';
            case 'REPLAY':
                return 'pi pi-play-circle';
            default:
                return 'pi pi-eye-slash';
        }
    };

    return {
        getWatchStatusIcon
    };
}