import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
    selector: 'app-favorite-button',
    templateUrl: './favorite-button.component.html',
    styleUrls: ['./favorite-button.component.scss']
})
export class FavoriteButtonComponent implements OnInit, OnDestroy {
    @Input() itemId!: string;
    @Input() itemType!: 'stock' | 'fund';
    @Input() size: 'small' | 'medium' | 'large' = 'small';
    @Output() favoriteToggled = new EventEmitter<boolean>();

    isFavorite = false;
    isLoading = false;
    private destroy$ = new Subject<void>();

    constructor(private favoritesService: FavoritesService) { }

    ngOnInit(): void {
        // Subscribe to favorites state changes
        this.favoritesService.getFavoritesState()
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.isFavorite = this.favoritesService.isFavorite(this.itemId, this.itemType);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleFavorite(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        this.isLoading = true;

        this.favoritesService.toggleFavorite(this.itemId, this.itemType)
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    this.favoriteToggled.emit(this.isFavorite);
                },
                error: (error) => {
                    console.error('Error toggling favorite:', error);
                    this.isLoading = false;
                }
            });
    }

    getSizeClass(): string {
        switch (this.size) {
            case 'small':
                return 'h-3.5 w-3.5';
            case 'medium':
                return 'h-5 w-5';
            case 'large':
                return 'h-6 w-6';
            default:
                return 'h-3.5 w-3.5';
        }
    }

    getButtonPadding(): string {
        switch (this.size) {
            case 'small':
                return 'p-1';
            case 'medium':
                return 'p-1.5';
            case 'large':
                return 'p-2';
            default:
                return 'p-1';
        }
    }
}
