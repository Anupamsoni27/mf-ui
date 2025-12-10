import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile, AuthState } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState$ = new BehaviorSubject<AuthState>({
        isAuthenticated: false,
        user: null,
        accessToken: null
    });

    constructor(private router: Router) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        // Check if user is already logged in from localStorage
        const storedToken = localStorage.getItem('google_access_token');
        const storedUser = localStorage.getItem('google_user_profile');

        if (storedToken && storedUser) {
            try {
                const user: UserProfile = JSON.parse(storedUser);
                this.authState$.next({
                    isAuthenticated: true,
                    user,
                    accessToken: storedToken
                });
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.clearAuthData();
            }
        }

        // Load Google Identity Services
        this.loadGoogleScript();
    }

    private loadGoogleScript(): void {
        if (typeof google !== 'undefined') {
            this.initializeGoogleSignIn();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initializeGoogleSignIn();
        script.onerror = () => {
            console.error('Failed to load Google Identity Services script');
            // Expose a flag that login component can read via AuthService
            (window as any).googleScriptLoadFailed = true;
        };
        document.head.appendChild(script);
    }

    private initializeGoogleSignIn(): void {
        if (typeof google === 'undefined') return;

        google.accounts.id.initialize({
            client_id: environment.google.clientId,
            callback: (response: any) => this.handleCredentialResponse(response),
            auto_select: false
        });
    }

    private handleCredentialResponse(response: any): void {
        if (response.credential) {
            // Decode JWT token to get user info
            const payload = this.parseJwt(response.credential);

            const user: UserProfile = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                givenName: payload.given_name,
                familyName: payload.family_name,
                emailVerified: payload.email_verified
            };

            // Store auth data
            localStorage.setItem('google_access_token', response.credential);
            localStorage.setItem('google_user_profile', JSON.stringify(user));

            // Update auth state
            this.authState$.next({
                isAuthenticated: true,
                user,
                accessToken: response.credential
            });

            // Navigate to stocks page
            this.router.navigate(['/stocks']);
        }
    }

    private parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return {};
        }
    }

    public login(): void {
        if (typeof google === 'undefined') {
            console.error('Google Sign-In not loaded');
            return;
        }

        google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.log('Google Sign-In prompt not displayed or skipped');
            }
        });
    }

    public renderGoogleButton(element: HTMLElement): void {
        if (typeof google === 'undefined') {
            console.error('Google Sign-In not loaded');
            return;
        }

        google.accounts.id.renderButton(element, {
            theme: 'filled_black',
            size: 'large',
            width: 350,
            text: 'signin_with'
        });
    }

    public logout(): void {
        // Clear local storage
        this.clearAuthData();

        // Update auth state
        this.authState$.next({
            isAuthenticated: false,
            user: null,
            accessToken: null
        });

        // Revoke Google session
        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
        }

        // Navigate to login
        this.router.navigate(['/login']);
    }

    private clearAuthData(): void {
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_user_profile');
    }

    public isAuthenticated(): boolean {
        return this.authState$.value.isAuthenticated;
    }

    public getAuthState(): Observable<AuthState> {
        return this.authState$.asObservable();
    }

    public getUserProfile(): UserProfile | null {
        return this.authState$.value.user;
    }

    public getAccessToken(): string | null {
        return this.authState$.value.accessToken;
    }
}
