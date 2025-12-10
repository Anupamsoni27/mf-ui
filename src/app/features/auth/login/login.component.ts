import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChild('googleButton', { static: true }) googleButton!: ElementRef;
    returnUrl: string = '/stocks';
    loading: boolean = true;
    error: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Check if already authenticated
        if (this.authService.isAuthenticated()) {
            this.router.navigate([this.returnUrl]);
            return;
        }

        // Get return URL from route parameters or default to '/stocks'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/stocks';
    }

    ngAfterViewInit(): void {
        // Attempt to render Google button with retry logic
        this.renderButtonWithRetry();
    }

    private renderButtonWithRetry(attempts: number = 0): void {
        const maxAttempts = 10;
        const retryDelay = 500; // ms

        // Check if script failed to load
        if ((window as any).googleScriptLoadFailed) {
            this.error = 'Failed to load Google Sign-In. Please refresh the page.';
            this.loading = false;
            this.cd.detectChanges();
            return;
        }

        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            try {
                this.authService.renderGoogleButton(this.googleButton.nativeElement);
                // Defer loading flag change to avoid ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.loading = false;
                    this.cd.detectChanges();
                }, 0);
            } catch (err) {
                console.error('Error rendering Google button:', err);
                this.error = 'Failed to load sign-in button';
                this.loading = false;
                this.cd.detectChanges();
            }
        } else if (attempts < maxAttempts) {
            setTimeout(() => this.renderButtonWithRetry(attempts + 1), retryDelay);
        } else {
            // Max attempts reached
            console.error('Google Sign-In failed to load after', maxAttempts, 'attempts');
            this.error = 'Failed to load Google Sign-In. Please refresh the page.';
            this.loading = false;
            this.cd.detectChanges();
        }
    }

    onGoogleLogin(): void {
        this.authService.login();
    }
}
