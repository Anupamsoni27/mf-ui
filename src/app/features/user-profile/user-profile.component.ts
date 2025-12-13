import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { FavoriteItem } from '../../shared/models/favorite.model';
import { StockService } from '../../core/services/stock.service';
import { FundService } from '../../core/services/fund.service';
import { UserProfile } from '../../shared/models/user.model';
import { Stock } from '../../shared/models/stock.model';
import { Fund } from '../../shared/models/fund.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: UserProfile | null = null;
  defaultAvatar = 'assets/images/default-avatar.png';

  favoriteStocks: Stock[] = [];
  favoriteFunds: Fund[] = [];
  loadingFavorites = false;
  favoritesError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private stockService: StockService,
    private fundService: FundService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserProfile();
    this.loadFavorites();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFavorites(): void {
    this.loadingFavorites = true;
    this.favoritesError = null;

    // Get favorite stock items
    this.favoritesService.getFavorites('stock')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: FavoriteItem[]) => {
          if (items.length > 0) {
            // Optimization: Use the name directly from FavoritesService
            // This avoids N+1 API calls. Sector info will be unavailable (N/A).
            this.favoriteStocks = items.map((item: FavoriteItem) => ({
              _id: item.id,
              name: item.name || 'Unknown Stock',
              instrument_type: 'Equity', // Default
              sector: '', // Sector info not available in optimized view
              url: '',
              funds_holding_count: 0,
              timeline: []
            } as Stock));
          } else {
            this.favoriteStocks = [];
          }
          this.loadingFavorites = false;
        },
        error: (error) => {
          console.error('Error loading favorite stocks:', error);
          this.favoritesError = 'Failed to load favorites';
          this.loadingFavorites = false;
        }
      });

    // Get favorite fund items
    this.favoritesService.getFavorites('fund')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: FavoriteItem[]) => {
          if (items.length > 0) {
            // Map FavoriteItem {id, name} to Fund model
            this.favoriteFunds = items.map((item: FavoriteItem) => ({
              _id: item.id,
              name: item.name
            } as Fund));
          }
        },
        error: (error) => {
          console.error('Error loading favorite funds:', error);
        }
      });
  }

  viewStock(stockId: string): void {
    this.router.navigate(['/stocks'], { queryParams: { id: stockId } });
  }

  viewFund(fundId: string): void {
    this.router.navigate(['/funds'], { queryParams: { selected: fundId } });
  }

  removeStock(stockId: string): void {
    this.favoritesService.removeFavorite(stockId, 'stock')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.favoriteStocks = this.favoriteStocks.filter(s => s._id !== stockId);
        },
        error: (error) => {
          console.error('Error removing favorite stock:', error);
          // Optional: Show error message
        }
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
}
