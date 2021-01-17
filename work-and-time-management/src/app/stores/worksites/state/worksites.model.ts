export interface Worksite {
    id: string;
    name: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    city: string;
    postalCode: number;
    streetAddress: string;
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
