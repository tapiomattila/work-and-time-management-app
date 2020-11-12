export interface UserHours {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    _c: string;
    hours?: HoursByData[];
    calculatedSum?: number;
}

interface HoursByData {
    worksiteId: string;
    worktypeId: string;
    hours: number;
}

export function createUserHours(userHours: Partial<UserHours>) {
    return {
        id: userHours.id,
        ...userHours
    } as UserHours;
}
