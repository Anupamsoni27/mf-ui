import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="flex flex-col justify-between w-64 min-w-64 max-w-64 h-full bg-slate-900 border-r border-slate-800 text-slate-100 shadow-md z-30">
      <div>
        <!-- Brand/Logo -->
        <div class="flex items-center h-16 px-6 gap-2">
          <div class="bg-emerald-600 rounded-full w-9 h-9 flex items-center justify-center text-white font-bold text-lg">S</div>
          <span class="ml-2 font-extrabold text-xl tracking-tight text-emerald-400">StockDash</span>
        </div>
        
        <!-- Navigation -->
        <nav class="mt-8 flex flex-col gap-2">
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition border-l-4 border-transparent" [routerLink]="['/dashboard']" routerLinkActive="!bg-slate-800 bg-emerald-900/20 text-emerald-300 font-bold border-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Overview
          </a>
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition border-l-4 border-transparent" [routerLink]="['/stocks']" routerLinkActive="!bg-slate-800 bg-emerald-900/20 text-emerald-300 font-bold border-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Stocks
          </a>
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition border-l-4 border-transparent" [routerLink]="['/funds']" routerLinkActive="!bg-slate-800 bg-emerald-900/20 text-emerald-300 font-bold border-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Funds
          </a>
        </nav>

        <!-- Sidebar Widgets (Projected Content) -->
        <div class="mt-8 px-6">
          <ng-content select="[sidebar-widgets]"></ng-content>
        </div>
      </div>

      <!-- Sidebar Footer - User Profile -->
      <div class="flex items-center justify-between px-6 h-20 border-t border-slate-800 mt-2">
        <div *ngIf="userProfile" class="flex items-center gap-2 flex-1 min-w-0">
          <!-- User Avatar -->
          <img *ngIf="userProfile.picture" [src]="userProfile.picture" [alt]="userProfile.name" 
            class="w-8 h-8 rounded-full border-2 border-emerald-500">
          <div *ngIf="!userProfile.picture" 
            class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold text-xs">
            {{ getInitials(userProfile.name) }}
          </div>
          
          <!-- User Info -->
          <div class="flex flex-col flex-1 min-w-0">
            <span class="text-xs font-medium text-slate-200 truncate" [title]="userProfile.name">
              {{ userProfile.name }}
            </span>
            <span class="text-[10px] text-slate-400 truncate" [title]="userProfile.email">
              {{ userProfile.email }}
            </span>
          </div>
        </div>
        
        <!-- Logout Button -->
        <button *ngIf="userProfile" (click)="onLogout()" 
          class="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500" 
          title="Sign out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(private authService: AuthService) { }

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

  onLogout(): void {
    this.authService.logout();
  }
}
