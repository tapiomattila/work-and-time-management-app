export interface Auth {
    id: string;
    isAuthenticated: boolean;
    clientId: string;
}

export function createAuth(auth: Partial<Auth>) {
    return {
        id: auth.id,
        ...auth
    } as Auth;
}
