
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { FavoriteListResponse, AddFavoriteRequest, RemoveFavoriteRequest, FavoriteToggleResponse, FavoriteStats, FavoriteItem } from '../../shared/models/favorite.model';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private favoritesState$ = new BehaviorSubject<{
        stocks: Map<string, string>; // ID -> Name
        funds: Map<string, string>;  // ID -> Name
        loaded: boolean;
    }>({
        stocks: new Map(),
        funds: new Map(),
        loaded: false
    });

    private currentUserId: string | null = null;

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        // Load favorites when user is authenticated
        this.authService.getAuthState().subscribe(authState => {
            if (authState.isAuthenticated && authState.user) {
                this.currentUserId = authState.user.id; // Store current user ID
                this.loadFavorites();
            } else {
                this.currentUserId = null;
                // Clear favorites when user logs out
                this.favoritesState$.next({
                    stocks: new Map(),
                    funds: new Map(),
                    loaded: false
                });
            }
        });
    }

    /**
     * Load all favorites from the backend
     */
    private loadFavorites(): void {
        if (!this.currentUserId) return;

        // Pass userId as query parameter
        this.apiService.get<FavoriteListResponse>(`/api/favorites?userId=${this.currentUserId}`)
            .pipe(
                catchError(error => {
                    console.error('Error loading favorites:', error);
                    // Return empty favorites on error
                    return throwError(() => error);
                })
            )
            .subscribe({
                next: (response) => {
                    const stocksMap = new Map<string, string>();
                    (response.data.stocks || []).forEach(item => stocksMap.set(item.id, item.name));

                    const fundsMap = new Map<string, string>();
                    (response.data.funds || []).forEach(item => fundsMap.set(item.id, item.name));

                    this.favoritesState$.next({
                        stocks: stocksMap,
                        funds: fundsMap,
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
    getFavorites(type?: 'stock' | 'fund'): Observable<FavoriteItem[]> {
        return this.favoritesState$.pipe(
            map(state => {
                if (type === 'stock') {
                    return Array.from(state.stocks.entries()).map(([id, name]) => ({ id, name }));
                } else if (type === 'fund') {
                    return Array.from(state.funds.entries()).map(([id, name]) => ({ id, name }));
                } else {
                    const stocks = Array.from(state.stocks.entries()).map(([id, name]) => ({ id, name }));
                    const funds = Array.from(state.funds.entries()).map(([id, name]) => ({ id, name }));
                    return [...stocks, ...funds];
                }
            })
        );
    }

    /**
     * Get favorites state as observable
     */
    getFavoritesState(): Observable<{ stocks: Map<string, string>; funds: Map<string, string>; loaded: boolean }> {
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
    addFavorite(itemId: string, itemType: 'stock' | 'fund', name: string = ''): Observable<FavoriteToggleResponse> {
        if (!this.currentUserId) {
            return throwError(() => new Error('User not authenticated'));
        }

        if (!name) {
            console.warn('Adding favorite without name, utilizing placeholder');
        }

        // Optimistic update
        const currentState = this.favoritesState$.value;
        const newState = {
            stocks: new Map(currentState.stocks),
            funds: new Map(currentState.funds),
            loaded: currentState.loaded
        };

        if (itemType === 'stock') {
            newState.stocks.set(itemId, name);
        } else {
            newState.funds.set(itemId, name);
        }

        this.favoritesState$.next(newState);

        const request: AddFavoriteRequest = {
            userId: this.currentUserId,
            itemId,
            itemType,
            itemName: name
        };

        return this.apiService.post<FavoriteToggleResponse>('/api/favorites/rpc/add', request)
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
        if (!this.currentUserId) {
            return throwError(() => new Error('User not authenticated'));
        }

        // Optimistic update
        const currentState = this.favoritesState$.value;
        const newState = {
            stocks: new Map(currentState.stocks),
            funds: new Map(currentState.funds),
            loaded: currentState.loaded
        };

        if (itemType === 'stock') {
            newState.stocks.delete(itemId);
        } else {
            newState.funds.delete(itemId);
        }

        this.favoritesState$.next(newState);

        const request: RemoveFavoriteRequest = {
            userId: this.currentUserId,
            itemId,
            itemType
        };

        return this.apiService.post<FavoriteToggleResponse>('/api/favorites/rpc/remove', request)
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
    toggleFavorite(itemId: string, itemType: 'stock' | 'fund', name: string = ''): Observable<FavoriteToggleResponse> {
        if (this.isFavorite(itemId, itemType)) {
            return this.removeFavorite(itemId, itemType);
        } else {
            return this.addFavorite(itemId, itemType, name);
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
