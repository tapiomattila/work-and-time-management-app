export function formatHours(hours: number) {
    if (typeof(hours) === 'number') {
        const frac = hours % 1;
        const full = hours - frac;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        if (!full) {
            return `${frac * 60}min`;
        }

        return `${full}h ${frac * 60}min`;
    } else {
        return hours;
    }
}
