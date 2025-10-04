import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FundService } from '../../../core/services/fund.service';
import { FundInfo, Fund } from '../../../shared/models/fund.model';
import { Stock } from '../../../shared/models/stock.model';

@Component({
  selector: 'app-fund-detail',
  templateUrl: './fund-detail.component.html',
  styleUrls: ['./fund-detail.component.scss']
})
export class FundDetailComponent implements OnInit {
  fundInfo: FundInfo | null = null;
  loading: boolean = false;
  error: string | null = null;
  fundId: string | null = null;

  constructor(
    private fundService: FundService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fundId = params['fundId'];
      if (this.fundId) {
        this.loadFundDetails();
      }
    });
  }

  loadFundDetails(): void {
    if (!this.fundId) return;
    
    this.loading = true;
    this.error = null;
    
    this.fundService.getFundInfo(this.fundId).subscribe({
      next: (fundInfo: FundInfo) => {
        this.fundInfo = fundInfo;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load fund details';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/funds']);
  }

  viewStock(stockId: string): void {
    this.router.navigate(['/stocks', stockId]);
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