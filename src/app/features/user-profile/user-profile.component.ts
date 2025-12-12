import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
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

    // Get favorite stock IDs
    this.favoritesService.getFavorites('stock')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stockIds) => {
          if (stockIds.length > 0) {
            // Load stock details (you may need to add a method to get multiple stocks)
            // For now, we'll just store the IDs
            this.favoriteStocks = stockIds.map(id => ({ _id: id } as Stock));
          }
          this.loadingFavorites = false;
        },
        error: (error) => {
          console.error('Error loading favorite stocks:', error);
          this.favoritesError = 'Failed to load favorites';
          this.loadingFavorites = false;
        }
      });

    // Get favorite fund IDs
    this.favoritesService.getFavorites('fund')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (fundIds) => {
          if (fundIds.length > 0) {
            this.favoriteFunds = fundIds.map(id => ({ _id: id } as Fund));
          }
        },
        error: (error) => {
          console.error('Error loading favorite funds:', error);
        }
      });
  }

  viewStock(stockId: string): void {
    this.router.navigate(['/stocks'], { queryParams: { selected: stockId } });
  }

  viewFund(fundId: string): void {
    this.router.navigate(['/funds'], { queryParams: { selected: fundId } });
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
