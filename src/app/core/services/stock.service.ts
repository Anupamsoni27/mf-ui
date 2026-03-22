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

  getAllStocks(skip: number = 0, limit: number = 10, search?: string, sortBy?: string, order?: string): Observable<StockListResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('show_timeline', "true")
      .set('timeline_limit', 25)
      .set('limit', limit.toString());

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (sortBy) {
      params = params.set('sort_by', sortBy);
    }
    if (order) {
      params = params.set('order', order);
    }

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

  getYfinanceStockData(symbol: string, startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol + '.NS')
      .set('start_date', startDate)
      .set('end_date', endDate);
    
    return this.apiService.get<any>('/getYfinanceStockData', params);
  }
  // Generic helper for YFinance modular endpoint
  private getYfinanceStocksDetails(tab: string, symbol: string, extraParams?: HttpParams): Observable<any> {
    const url = `/getYfinanceStocksDetails/${tab}`;
    let params = new HttpParams().set('symbol', symbol + '.NS');
    if (extraParams) {
      // Merge extra parameters
      extraParams.keys().forEach(key => {
        params = params.set(key, extraParams.get(key) as string);
      });
    }
    return this.apiService.get<any>(url, params);
  }

  // Specific tab methods
  getOverview(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('overview', symbol);
  }

  getPrice(symbol: string, range?: string): Observable<any> {
    const extra = range ? new HttpParams().set('range', range) : undefined;
    return this.getYfinanceStocksDetails('price', symbol, extra);
  }

  getFundamentals(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('fundamentals', symbol);
  }

  getFinancials(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('financials', symbol);
  }

  getValuation(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('valuation', symbol);
  }

  getGovernance(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('governance', symbol);
  }

  getAnalyst(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('analyst', symbol);
  }

  getCompany(symbol: string): Observable<any> {
    return this.getYfinanceStocksDetails('company', symbol);
  }

}

