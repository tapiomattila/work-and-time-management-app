export function formatHours(hours: number) {
    if (typeof(hours) === 'number') {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    } else {
        return hours;
    }
}
