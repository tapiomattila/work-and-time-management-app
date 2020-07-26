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
