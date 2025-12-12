export enum FavoriteType {
    STOCK = 'stock',
    FUND = 'fund'
}

export interface Favorite {
    _id: string;
    userId: string;
    itemId: string;
    itemType: FavoriteType;
    createdAt: Date;
    updatedAt?: Date;
}

export interface FavoriteListResponse {
    status: string;
    count: number;
    data: {
        stocks: string[];
        funds: string[];
    };
}

export interface FavoriteToggleRequest {
    itemId: string;
    itemType: FavoriteType | 'stock' | 'fund';
}

export interface FavoriteToggleResponse {
    status: string;
    message: string;
    data?: Favorite;
}

export interface FavoriteStats {
    totalFavorites: number;
    stockCount: number;
    fundCount: number;
}
