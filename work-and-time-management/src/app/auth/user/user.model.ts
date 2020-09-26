export interface User {
    id: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isManager: boolean;
    profilePictureUrl: string;
    email: string;
    displayName: string;
    _c: string;
}

export function createUser(user: Partial<User>) {
    return {
        id: user.id,
        ...user
    } as User;
}
