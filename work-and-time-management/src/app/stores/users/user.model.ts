export interface User {
    id: string;
    clientId: string;
    displayName: string;
    userId: string;
    roles: string[];
    info?: UserInfo;
}

interface UserInfo {
    email: string;
    address?: UserAddress;
    firstName?: string;
    lastName?: string;
}

interface UserAddress {
    streetAddress: string;
    city: string;
    postalCode: string;
}

export function createUser(user: Partial<User>) {
    return {
        id: user.userId,
        ...user,
    } as User;
}
