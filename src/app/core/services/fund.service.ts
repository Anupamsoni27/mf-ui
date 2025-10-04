import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Fund, FundInfo, FundListResponse, FundInfoResponse } from '../../shared/models/fund.model';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  constructor(private apiService: ApiService) { }

  getAllFunds(skip: number = 0, limit: number = 10, date?: string): Observable<FundListResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());
    
    if (date) {
      params = params.set('date', date);
    }
    
    return this.apiService.get<FundListResponse>('/getAllFunds', params);
  }

  getFundInfo(fundId: string, date?: string): Observable<FundInfo> {
    let params = new HttpParams().set('fund_id', fundId);
    if (date) {
      params = params.set('date', date);
    }
    return this.apiService.get<FundInfoResponse>('/getFundInfo', params).pipe(
      map((response: FundInfoResponse) => {
        // Handle both wrapped and direct responses
        return response.data || response as any;
      })
    );
  }
}