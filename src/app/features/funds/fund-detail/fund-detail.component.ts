import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FundService } from '../../../core/services/fund.service';
import { FundInfo, Fund } from '../../../shared/models/fund.model';
import { Stock } from '../../../shared/models/stock.model';
import * as Highcharts from 'highcharts';

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
  filterForm: FormGroup;
  selectedDate: string | null = null;

  // Pagination for stocks
  stocksPage: number = 0;
  stocksPageSize: number = 10;
  // Search for stocks
  stocksSearchTerm: string = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  chartOptions2: Highcharts.Options = {
    title: { text: 'Fund Timeline' },
    xAxis: { type: 'datetime', title: { text: 'Date' } },
    yAxis: { title: { text: 'Fund Count' } },
    series: [{ type: 'line', name: 'Fund Count', data: [] }],
    credits: { enabled: false }
  };

  constructor(
    private fundService: FundService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      date: ['']
    });
  }

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

    this.fundService.getFundInfo(this.fundId, this.selectedDate || undefined).subscribe({
      next: (fundInfo: any) => {
        console.log(fundInfo)
        this.fundInfo = fundInfo.records;
        this.loadChart();
        this.updateChart();
        this.stocksPage = 0; // Reset stocks pagination on new data
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

  onDateChange(): void {
    this.selectedDate = this.filterForm.get('date')?.value;
    this.loadFundDetails();
  }

  clearDateFilter(): void {
    this.filterForm.patchValue({ date: '' });
    this.selectedDate = null;
    this.loadFundDetails();
  }

  getFilterSummary(): string {
    if (this.selectedDate) {
      return `Filtered by date: ${this.selectedDate}`;
    }
    return 'Showing latest fund data';
  }

  // Pagination logic for stocks
  get paginatedStocks(): Stock[] {
    if (!this.fundInfo || !this.fundInfo.stocks) return [];
    let filtered = this.fundInfo.stocks;
    if (this.stocksSearchTerm.trim()) {
      const term = this.stocksSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(stock =>
        (stock.name && stock.name.toLowerCase().includes(term)) ||
        (stock._id && stock._id.toLowerCase().includes(term)) ||
        (stock.sector && stock.sector.toLowerCase().includes(term))
      );
    }
    const start = this.stocksPage * this.stocksPageSize;
    return filtered.slice(start, start + this.stocksPageSize);
  }

  get stocksTotal(): number {
    if (!this.fundInfo || !this.fundInfo.stocks) return 0;
    if (!this.stocksSearchTerm.trim()) return this.fundInfo.stocks.length;
    const term = this.stocksSearchTerm.trim().toLowerCase();
    return this.fundInfo.stocks.filter(stock =>
      (stock.name && stock.name.toLowerCase().includes(term)) ||
      (stock._id && stock._id.toLowerCase().includes(term)) ||
      (stock.sector && stock.sector.toLowerCase().includes(term))
    ).length;
  }

  get stocksHasNextPage(): boolean {
    return ((this.stocksPage + 1) * this.stocksPageSize) < this.stocksTotal;
  }

  stocksNextPage(): void {
    if (this.stocksHasNextPage) {
      this.stocksPage++;
    }
  }

  stocksPreviousPage(): void {
    if (this.stocksPage > 0) {
      this.stocksPage--;
    }
  }


  loadChart() {
    const sectorCount: { [key: string]: number } = {};

    this.fundInfo?.stocks.forEach(stock => {
      if (stock.sector) {
        sectorCount[stock.sector] = (sectorCount[stock.sector] || 0) + 1;
      }
    });

    const data = Object.entries(sectorCount).map(([sector, count]) => ({
      name: sector,
      y: count,
    }));

    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
      },
      title: {
        text: 'Stock Distribution by Sector',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y} stocks)',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          showInLegend: true,
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Sector Share',
          data,
        },
      ],
    };
  }



  updateChart() {
    if (!this.fundInfo || !this.fundInfo.fund_count) return;
    this.chartOptions2 = {
      ...this.chartOptions2,
      series: [{
        type: 'line',
        name: 'Fund Count',
        data: this.fundInfo.fund_count.map(point => [Date.parse(point.date), point.holding_count])
      }]
    };
  }
  protected readonly JSON = JSON;
  protected readonly Math = Math;
}
