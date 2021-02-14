export interface TableHours {
    id: string;
    marked: number;
    hoursFormatted: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedAtFormatted: string;
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
    worksiteName: string;
    worktypeId: string;
    worktypeName: string;
    marked: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    clientId: string;
}

export function createHours(hours: Partial<Hours>) {
    return {
        id: hours.id,
        ...hours
    } as Hours;
}
