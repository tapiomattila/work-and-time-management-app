export interface WorkType {
    id: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    workType: string;
    deleted: boolean;
    viewName: string;
}

export function createWorkType(worktype: Partial<WorkType>) {
    return {
        id: worktype.id,
        deleted: false,
        ...worktype
    } as WorkType;
}
