export interface TableHours {
    id: string;
    hours: number;
    hoursFormatted: string;
    createdAt: string;
    updateAt: string;
    updateAtFormatted: string;
    worksiteId: string;
    worksiteName: string;
    worktypeId: string;
    worktypeName: string;
}

export interface Hours {
    id: string;
    userId: string;
    worksiteId: string;
    worktypeId: string;
    markedHours: number;
    createdAt: string;
    updatedAt: string;
}

export function createHours(hours: Partial<Hours>) {
    return {
        id: hours.id,
        ...hours
    } as Hours;
}
