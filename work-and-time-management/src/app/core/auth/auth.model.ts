export interface Auth {
    id: string;
    isAuthenticated: boolean;
    clientId: string;
    email: string;
    displayName: string;
    profilePictureUrl: string;
}

export function createAuth(auth: Partial<Auth>) {
    return {
        id: auth.id,
        ...auth,
    } as Auth;
}
