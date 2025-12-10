import { Component, OnInit } from '@angular/core';

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
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition" [routerLink]="['/dashboard']" routerLinkActive="bg-slate-800 text-emerald-400">
            <span class="mr-3">🏠</span> Overview
          </a>
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition" [routerLink]="['/stocks']" routerLinkActive="bg-slate-800 text-emerald-400">
            <span class="mr-3">📈</span> Stocks
          </a>
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition" [routerLink]="['/funds']" routerLinkActive="bg-slate-800 text-emerald-400">
            <span class="mr-3">💰</span> Funds
          </a>
          <!-- <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition" [routerLink]="['/reports']" routerLinkActive="bg-slate-800 text-emerald-400">
            <span class="mr-3">📊</span> Reports
          </a>
          <a class="flex items-center px-6 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 transition" [routerLink]="['/settings']" routerLinkActive="bg-slate-800 text-emerald-400">
            <span class="mr-3">⚙️</span> Settings
          </a> -->
        </nav>

        <!-- Sidebar Widgets (Projected Content) -->
        <div class="mt-8 px-6">
          <ng-content select="[sidebar-widgets]"></ng-content>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="flex items-center px-6 h-20 border-t border-slate-800 mt-2">
        <div class="flex items-center gap-2">
          <div class="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">A</div>
          <div class="flex flex-col">
            <span class="text-xs font-medium text-slate-200">Anupam S</span>
            <a href="#" class="text-xs text-emerald-400 hover:underline">Profile</a>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
