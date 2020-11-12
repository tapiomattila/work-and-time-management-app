export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    _c: string;
    hours: number;
    calculatedSum: number;
}

export function createUser(user: Partial<User>) {
    return {
        id: user.id,
        ...user
    } as User;
}
