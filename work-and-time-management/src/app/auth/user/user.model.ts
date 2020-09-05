export interface User {
    id: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isManager: boolean;
    profilePictureUrl: string;
    email: string;
    displayName: string;
}

export function createUser(user: Partial<User>) {
    return {
        id: user.id,
        ...user
    } as User;
}
