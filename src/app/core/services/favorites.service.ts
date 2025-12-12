import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { FavoriteListResponse, FavoriteToggleRequest, FavoriteToggleResponse, FavoriteStats, FavoriteType } from '../../shared/models/favorite.model';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private favoritesState$ = new BehaviorSubject<{
        stocks: Set<string>;
        funds: Set<string>;
        loaded: boolean;
    }>({
        stocks: new Set(),
        funds: new Set(),
        loaded: false
    });

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        // Load favorites when user is authenticated
        this.authService.getAuthState().subscribe(authState => {
            if (authState.isAuthenticated) {
                this.loadFavorites();
            } else {
                // Clear favorites when user logs out
                this.favoritesState$.next({
                    stocks: new Set(),
                    funds: new Set(),
                    loaded: false
                });
            }
        });
    }

    /**
     * Load all favorites from the backend
     */
    private loadFavorites(): void {
        this.apiService.get<FavoriteListResponse>('/api/favorites')
            .pipe(
                catchError(error => {
                    console.error('Error loading favorites:', error);
                    // Return empty favorites on error
                    return throwError(() => error);
                })
            )
            .subscribe({
                next: (response) => {
                    this.favoritesState$.next({
                        stocks: new Set(response.data.stocks || []),
                        funds: new Set(response.data.funds || []),
                        loaded: true
                    });
                },
                error: () => {
                    // Set loaded to true even on error to prevent infinite loading
                    this.favoritesState$.next({
                        ...this.favoritesState$.value,
                        loaded: true
                    });
                }
            });
    }

    /**
     * Get all favorites or filtered by type
     */
    getFavorites(type?: 'stock' | 'fund'): Observable<string[]> {
        return this.favoritesState$.pipe(
            map(state => {
                if (type === 'stock') {
                    return Array.from(state.stocks);
                } else if (type === 'fund') {
                    return Array.from(state.funds);
                } else {
                    return [...Array.from(state.stocks), ...Array.from(state.funds)];
                }
            })
        );
    }

    /**
     * Get favorites state as observable
     */
    getFavoritesState(): Observable<{ stocks: Set<string>; funds: Set<string>; loaded: boolean }> {
        return this.favoritesState$.asObservable();
    }

    /**
     * Check if an item is favorited
     */
    isFavorite(itemId: string, itemType: 'stock' | 'fund'): boolean {
        const state = this.favoritesState$.value;
        if (itemType === 'stock') {
            return state.stocks.has(itemId);
        } else {
            return state.funds.has(itemId);
        }
    }

    /**
     * Add an item to favorites
     */
    addFavorite(itemId: string, itemType: 'stock' | 'fund'): Observable<FavoriteToggleResponse> {
        // Optimistic update
        const currentState = this.favoritesState$.value;
        const newState = { ...currentState };

        if (itemType === 'stock') {
            newState.stocks = new Set(currentState.stocks);
            newState.stocks.add(itemId);
        } else {
            newState.funds = new Set(currentState.funds);
            newState.funds.add(itemId);
        }

        this.favoritesState$.next(newState);

        const request: FavoriteToggleRequest = { itemId, itemType };

        return this.apiService.post<FavoriteToggleResponse>('/api/favorites', request)
            .pipe(
                catchError(error => {
                    // Revert optimistic update on error
                    this.favoritesState$.next(currentState);
                    console.error('Error adding favorite:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Remove an item from favorites
     */
    removeFavorite(itemId: string, itemType: 'stock' | 'fund'): Observable<FavoriteToggleResponse> {
        // Optimistic update
        const currentState = this.favoritesState$.value;
        const newState = { ...currentState };

        if (itemType === 'stock') {
            newState.stocks = new Set(currentState.stocks);
            newState.stocks.delete(itemId);
        } else {
            newState.funds = new Set(currentState.funds);
            newState.funds.delete(itemId);
        }

        this.favoritesState$.next(newState);

        return this.apiService.delete<FavoriteToggleResponse>(`/api/favorites/${itemId}?type=${itemType}`)
            .pipe(
                catchError(error => {
                    // Revert optimistic update on error
                    this.favoritesState$.next(currentState);
                    console.error('Error removing favorite:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Toggle favorite status
     */
    toggleFavorite(itemId: string, itemType: 'stock' | 'fund'): Observable<FavoriteToggleResponse> {
        if (this.isFavorite(itemId, itemType)) {
            return this.removeFavorite(itemId, itemType);
        } else {
            return this.addFavorite(itemId, itemType);
        }
    }

    /**
     * Get favorite statistics
     */
    getStats(): Observable<FavoriteStats> {
        return this.favoritesState$.pipe(
            map(state => ({
                stockCount: state.stocks.size,
                fundCount: state.funds.size,
                totalFavorites: state.stocks.size + state.funds.size
            }))
        );
    }

    /**
     * Refresh favorites from backend
     */
    refresh(): void {
        this.loadFavorites();
    }
}
