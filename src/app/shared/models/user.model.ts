export interface UserProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
    givenName?: string;
    familyName?: string;
    emailVerified?: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    accessToken: string | null;
}
