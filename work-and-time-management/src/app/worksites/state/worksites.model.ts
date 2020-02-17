export interface Worksite {
    id: string,
    nickname: string,
    streetAddress: string,
    postalCode: number,
    city: string,
    createdAt: Date,
    updatedAt: Date
}

export function createWorksite(worksite: Partial<Worksite>) {
    return {
        id: worksite.id,
        ...worksite
    } as Worksite;
}
