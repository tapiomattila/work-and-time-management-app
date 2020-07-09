export interface WorkType {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastUpdatedBy: string;
    workType: string;
    viewName: string;
}

export function createWorkType(worktype: Partial<WorkType>) {
    return {
        id: worktype.id,
        ...worktype
    } as WorkType;
}
