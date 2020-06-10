export interface Hours {
    id: string;
    userId: string;
    worksiteId: string;
    markedHours: number;
    createdAt: Date;
    updatedAt: Date;
}

export function createHours(hours: Partial<Hours>) {
    return {
        id: hours.id,
        ...hours
    } as Hours;
}
