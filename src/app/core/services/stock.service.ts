import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Stock, StockInfo, StockListResponse, StockInfoResponse } from '../../shared/models/stock.model';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private apiService: ApiService) { }

  getAllStocks(skip: number = 0, limit: number = 10): Observable<StockListResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('show_timeline', "true")
      .set('timeline_limit', 10)
      .set('limit', limit.toString());


    return this.apiService.get<StockListResponse>('/getAllStocks', params);
  }

  getStockInfo(stockId: string): Observable<StockInfo> {
    const params = new HttpParams().set('stock_id', stockId);
    return this.apiService.get<StockInfoResponse>('/getStockInfo', params).pipe(
      map((response: StockInfoResponse) => {
        // Handle both wrapped and direct responses
        return response.data || response as any;
      })
    );
  }
}
