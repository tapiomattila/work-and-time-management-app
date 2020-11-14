export interface Users {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    _c: string;
    hours: number;
    calculatedSum: number;
}

export function createUser(user: Partial<Users>) {
    return {
        id: user.id,
        ...user
    } as Users;
}
