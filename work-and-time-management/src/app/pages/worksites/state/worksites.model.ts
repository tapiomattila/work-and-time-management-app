export interface Worksite {
    city: string;
    createdAt: string;
    createdBy: string;
    id: string;
    nickname: string;
    postalCode: number;
    streetAddress: string;
    updatedAt: string;
    updatedBy: string;
    deleted: boolean;
    users: string[];
    _c: string;
}

export function createWorksite(worksite: Partial<Worksite>) {
    return {
        id: worksite.id,
        deleted: false,
        ...worksite
    } as Worksite;
}
