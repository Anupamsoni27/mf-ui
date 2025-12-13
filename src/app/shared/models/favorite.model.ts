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

export interface FavoriteItem {
    id: string;
    name: string;
}

export interface FavoriteListResponse {
    status: string;
    count: number;
    data: {
        stocks: FavoriteItem[];
        funds: FavoriteItem[];
    };
}

export interface AddFavoriteRequest {
    userId: string;
    itemId: string;
    itemType: string;
    itemName: string;
}

export interface RemoveFavoriteRequest {
    userId: string;
    itemId: string;
    itemType: string;
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
