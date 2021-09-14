export function formatHours(hours: number) {
    if (typeof (hours) === 'number') {
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

export function mapSnapsWithId(snaps: any) {
    return snaps.map(snap => {
        const id = snap.payload.doc.id;
        const data = snap.payload.doc.data();
        return {
            id,
            ...(data as object)
        };
    });
}

export function mapSnaps(snaps: any) {
    return snaps.map(snap => {
        return {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data()
        };
    });
}

export function takeSnap(snap: any) {
    return {
        id: snap.payload.id,
        ...(snap.payload.data() as object)
    };
}

export function removeDublicates(array: any[]) {
    return [...new Set(array)]
}
