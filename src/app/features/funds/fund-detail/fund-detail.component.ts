import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FundService } from '../../../core/services/fund.service';
import { ThemeService } from '../../../core/services/theme.service';
import { FundInfo, Fund } from '../../../shared/models/fund.model';
import { Stock } from '../../../shared/models/stock.model';
import { AgChartOptions } from 'ag-charts-community';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fund-detail',
  templateUrl: './fund-detail.component.html',
  styleUrls: ['./fund-detail.component.scss']
})
export class FundDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() fundId: string | null = null;
  
  fundInfo: FundInfo | null = null;
  loading: boolean = false;
  error: string | null = null;
  filterForm: FormGroup;
  selectedDate: string | null = null;

  // Pagination for stocks
  stocksPage: number = 0;
  stocksPageSize: number = 10;
  // Search for stocks
  stocksSearchTerm: string = '';

  chartOptions: AgChartOptions = {};
  chartOptions2: AgChartOptions = {};
  
  private themeSubscription?: Subscription;

  constructor(
    private fundService: FundService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.filterForm = this.fb.group({
      date: ['']
    });
    
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(() => {
      this.updateChartTheme();
    });
  }

  ngOnInit(): void {
    // Support route params for direct navigation (backward compatibility)
    this.route.params.subscribe(params => {
      const routeFundId = params['fundId'];
      if (routeFundId && !this.fundId) {
        this.fundId = routeFundId;
        this.loadFundDetails();
      }
    });
    
    // Load if fundId was set via @Input
    if (this.fundId) {
      this.loadFundDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fundId'] && !changes['fundId'].firstChange) {
      if (this.fundId) {
        this.loadFundDetails();
      }
    }
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
      sector,
      count,
    }));

    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? this.getCSSVariableColor('--tv-text-primary') : '#172B4D';
    const backgroundColor = this.getCSSVariableColor('--tv-bg-panel');
    
    // Different color palettes for light and dark themes
    const colorPalette = isDark ? [
      '#2caffe', '#544fc5', '#00e272', '#fe6a35', '#6b8abc',
      '#d568fb', '#2ee0ca', '#fa4b42', '#feb56a', '#91e8e1'
    ] : [
      '#0C66E4', '#8B5CF6', '#059669', '#DC2626', '#F59E0B',
      '#C026D3', '#0891B2', '#EA580C', '#7C3AED', '#047857'
    ];
    
    this.chartOptions = {
      data,
      background: { fill: 'transparent' },
      title: {
        text: 'Sector Distribution',
        color: textColor,
        fontSize: 14,
        fontWeight: 'bold'
      },
      series: [
        {
          type: 'pie',
          angleKey: 'count',
          legendItemKey: 'sector',
          sectorLabelKey: 'sector',
          fills: colorPalette,
          strokes: colorPalette,
          tooltip: {
            renderer: (params: any) => ({
              title: params.datum.sector,
              content: `${params.datum.count} stocks (${((params.datum.count / data.reduce((sum: number, d: any) => sum + d.count, 0)) * 100).toFixed(1)}%)`
            })
          }
        },
      ],
      legend: {
        item: {
          label: {
            color: textColor,
            fontSize: 12
          }
        }
      }
    };
  }



  updateChart() {
    if (!this.fundInfo || !this.fundInfo.fund_count) return;
    
    const isDark = this.themeService.isDarkMode();
    const textColor = isDark ? this.getCSSVariableColor('--tv-text-primary') : '#172B4D';
    const gridColor = this.getCSSVariableColor('--tv-border');
    const lineColor = this.getCSSVariableColor('--tv-blue');
    
    const data = this.fundInfo.fund_count.map(point => ({
      date: new Date(point.date),
      holdingCount: point.holding_count
    }));

    this.chartOptions2 = {
      data,
      background: { fill: 'transparent' },
      title: {
        text: 'Fund Timeline',
        color: textColor,
        fontSize: 14,
        fontWeight: 'bold'
      },
      series: [{
        type: 'line',
        xKey: 'date',
        yKey: 'holdingCount',
        yName: 'Holding Count',
        stroke: lineColor,
        marker: { enabled: false }
      }],
      axes: [
        {
          type: 'time',
          position: 'bottom',
          title: { text: 'Date', color: textColor },
          label: { color: textColor },
          gridLine: { style: [{ stroke: gridColor }] },
          line: { color: gridColor }
        },
        {
          type: 'number',
          position: 'left',
          title: { text: 'Holding Count', color: textColor },
          label: { color: textColor },
          gridLine: { style: [{ stroke: gridColor }] }
        }
      ],
      legend: {
        item: {
          label: { color: textColor }
        }
      },
      tooltip: {
        class: 'ag-chart-tooltip'
      }
    };
  }

  updateChartTheme() {
    // Reload charts with new theme colors
    if (this.fundInfo) {
      this.loadChart();
      this.updateChart();
    }
  }

  getCSSVariableColor(variable: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  protected readonly JSON = JSON;
  protected readonly Math = Math;
}
