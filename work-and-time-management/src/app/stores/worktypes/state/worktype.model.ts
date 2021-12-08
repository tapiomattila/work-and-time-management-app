export interface WorkType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    deleted: boolean;
    rate: number;
    _c: string;
}

export function createWorkType(worktype: Partial<WorkType>) {
    return {
        id: worktype.id,
        deleted: false,
        ...worktype,
    } as WorkType;
}
