import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StockTimeline, StockTimelineResponse } from '../../shared/models/stock.model';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  constructor(private apiService: ApiService) { }

  getStockTimeline(stockId: string): Observable<StockTimeline> {
    const params = new HttpParams().set('stock_id', stockId);
    return this.apiService.get<StockTimelineResponse>('/getStockTimeline', params).pipe(
      map((response: StockTimelineResponse) => {
        // Handle both wrapped and direct responses
        return response.data || response as any;
      })
    );
  }
}