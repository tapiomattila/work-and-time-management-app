export interface TableHours {
    id: string;
    hours: number;
    hoursFormatted: string;
    createdAt: string;
    updatedAt: string;
    updatedAtFormatted: string;
    createdBy: string;
    updatedBy: string;
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
    hours: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    _c: string;
}

export function createHours(hours: Partial<Hours>) {
    return {
        id: hours.id,
        ...hours
    } as Hours;
}
