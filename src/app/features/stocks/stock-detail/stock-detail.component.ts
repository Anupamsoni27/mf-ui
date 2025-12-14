import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../../../core/services/stock.service';
import { StockInfo } from '../../../shared/models/stock.model';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit, OnChanges {
  stockInfo: StockInfo | null = null;
  loading: boolean = false;
  error: string | null = null;
  @Input() stockId: string | null = null;


  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.stockId) {
      this.loadStockDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockId'] && !changes['stockId'].firstChange) {
      if (this.stockId) {
        this.loadStockDetails();
      }
    }
  }


  loadStockDetails(): void {
    if (!this.stockId) return;

    this.loading = true;
    this.error = null;

    this.stockService.getStockInfo(this.stockId).subscribe({
      next: (stockInfo: any) => {
        this.stockInfo = stockInfo.records;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load stock details';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/stocks']);
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
