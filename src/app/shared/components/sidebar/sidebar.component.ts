import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../models/user.model';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <header class="top-nav">
      <div class="nav-container">
        <!-- Logo/Brand -->
        <div class="nav-brand">
          <div class="brand-icon">S</div>
          <span class="brand-name">StockDash</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="nav-menu">
          <a class="nav-item" [routerLink]="['/dashboard']" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a class="nav-item" [routerLink]="['/stocks']" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Stocks</span>
          </a>
          <a class="nav-item" [routerLink]="['/funds']" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Funds</span>
          </a>
          <a class="nav-item" [routerLink]="['/how-it-works']" routerLinkActive="active">
            <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>How It Works</span>
          </a>
        </nav>

        <!-- User Profile & Actions -->
        <div class="nav-actions">
           <!-- Theme Toggle -->
          <button (click)="toggleTheme()" class="theme-btn" [title]="(isDarkMode$ | async) ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <!-- Sun Icon (for Dark Mode) -->
            <svg *ngIf="(isDarkMode$ | async)" xmlns="http://www.w3.org/2000/svg" class="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon Icon (for Light Mode) -->
            <svg *ngIf="!(isDarkMode$ | async)" xmlns="http://www.w3.org/2000/svg" class="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <a *ngIf="userProfile" class="nav-item" [routerLink]="['/profile']" routerLinkActive="active">
            <img *ngIf="userProfile.picture" [src]="userProfile.picture" [alt]="userProfile.name" class="user-avatar">
            <div *ngIf="!userProfile.picture" class="user-avatar-text">{{ getInitials(userProfile.name) }}</div>
            <span class="user-name">{{ userProfile.name }}</span>
          </a>
          <button *ngIf="userProfile" (click)="onLogout()" class="logout-btn" title="Sign out">
            <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .top-nav {
      background: var(--tv-bg-panel);
      border-bottom: 1px solid var(--tv-border);
      height: 48px;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 100;
    }

    .nav-container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 16px;
      gap: 24px;
    }

    /* Brand */
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 24px;
      border-right: 1px solid var(--tv-border);
    }

    .brand-icon {
      background: var(--tv-blue);
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 14px;
    }

    .brand-name {
      font-weight: 700;
      font-size: 14px;
      color: var(--tv-text-primary);
      letter-spacing: -0.02em;
    }

    /* Navigation Menu */
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      color: var(--tv-text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s;
      border-radius: 0;
      border-bottom: 2px solid transparent;
      height: 48px;
      cursor: pointer;

      &:hover {
        color: var(--tv-text-primary);
        background: var(--tv-bg-hover);
      }

      &.active {
        color: var(--tv-blue);
        border-bottom-color: var(--tv-blue);
        background: transparent;
      }

      span {
        white-space: nowrap;
      }
    }

    .nav-icon {
      width: 16px;
      height: 16px;
    }

    /* User Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 24px;
      border-left: 1px solid var(--tv-border);
    }

    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-avatar-text {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--tv-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 600;
    }

    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logout-btn {
      padding: 6px;
      background: transparent;
      border: none;
      color: var(--tv-text-secondary);
      cursor: pointer;
      transition: color 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--tv-red);
      }
    }

    .logout-icon {
      width: 18px;
      height: 18px;
    }

    .theme-btn {
      padding: 6px;
      background: transparent;
      border: none;
      color: var(--tv-text-secondary);
      cursor: pointer;
      transition: color 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;

      &:hover {
        color: var(--tv-blue);
      }
    }

    .theme-icon {
      width: 20px;
      height: 20px;
    }
  `]
})
export class SidebarComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    // Subscribe to auth state to get user profile
    this.authService.getAuthState().subscribe(authState => {
      this.userProfile = authState.user;
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
