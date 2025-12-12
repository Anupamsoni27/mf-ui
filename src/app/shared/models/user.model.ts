export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    currency?: string;
    notifications?: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
    givenName?: string;
    familyName?: string;
    emailVerified?: boolean;
    roles?: UserRole[];
    preferences?: UserPreferences;
    favoriteStocks?: string[];
    favoriteFunds?: string[];
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    accessToken: string | null;
}
