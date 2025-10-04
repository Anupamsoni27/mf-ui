import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { Stock, StockListResponse } from '../../../shared/models/stock.model';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  stocks: Stock[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalStocks: number = 0;
  hasNextPage: boolean = false;
  searchTerm: string = '';
  sortBy: string = 'funds_holding_count';
  sortOrder: string = 'desc';

  Math = Math; // Make Math available in template

  constructor(
    private stockService: StockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;
    this.error = null;
    
    const skip = this.currentPage * this.pageSize;
    
    this.stockService.getAllStocks(skip, this.pageSize, this.searchTerm, this.sortBy, this.sortOrder).subscribe({
      next: (response: StockListResponse) => {
        this.stocks = response.records;
        this.totalStocks = response.count;
        this.hasNextPage = (skip + this.pageSize) < response.count;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load stocks';
        this.loading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0;
    this.loadStocks();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 0;
    this.loadStocks();
  }

  onOrderChange(order: string): void {
    this.sortOrder = order;
    this.currentPage = 0;
    this.loadStocks();
  }

  viewStock(stockId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/stocks', stockId]);
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadStocks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadStocks();
    }
  }

  getChangeClass(changePercent: number): string {
    if (changePercent > 0) {
      return 'text-green-600';
    } else if (changePercent < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  }
}