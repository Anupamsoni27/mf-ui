import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { StockTimeline, TimelineDataPoint } from '../../../shared/models/stock.model';
import { StockService } from '../../../core/services/stock.service';
import { AgChartOptions } from 'ag-charts-community';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-timeline',
  templateUrl: './stock-timeline.component.html',
  styleUrls: ['./stock-timeline.component.scss']
})
export class StockTimelineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stockId: string = '';
  @Input() symbol: string = '';

  timelineData: StockTimeline | null = null;
  loading: boolean = false;
  error: string | null = null;
  showAll: boolean = false;
  activeChartView: 'classic' | 'percentage' = 'percentage';
  private themeSubscription: Subscription | null = null;

  chartOptions: AgChartOptions = {
    background: { fill: '#131722' },
    title: {
      text: '',
      color: '#D1D4DC'
    },
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'price',
        yName: 'Stock Price',
        stroke: '#2962FF',
        strokeWidth: 2,
        marker: { enabled: false }
      },
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'fundCount',
        yName: 'Holdings Count',
        fill: '#00e272',
        fillOpacity: 0.7,
        strokeWidth: 0
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        line: { color: '#2A2E39' },
        tick: { color: '#2A2E39' },
        gridLine: { style: [{ stroke: '#2A2E39' }] },
        label: {
          color: '#787B86',
          fontSize: 11
        },
        crosshair: {
          stroke: '#2A2E39',
          lineDash: [4, 4]
        }
      },
      {
        type: 'number',
        position: 'right',
        keys: ['fundCount'],
        title: { text: '' },
        gridLine: { style: [{ stroke: '#2A2E39' }] },
        label: {
          color: '#787B86',
          fontSize: 11
        }
      },
      {
        type: 'number',
        position: 'left',
        keys: ['price'],
        title: { text: '' },
        gridLine: { style: [{ stroke: '#2A2E39' }] },
        label: {
          color: '#787B86',
          fontSize: 11
        }
      }
    ],
    tooltip: {
      class: 'ag-chart-tooltip'
    }
  } as any;

  chartOptionsPct: AgChartOptions = {
    background: { fill: '#131722' },
    title: {
      text: 'Percentage Growth (Since Day 1)',
      color: '#D1D4DC'
    },
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'pricePct',
        yName: 'Stock Growth %',
        stroke: '#2962FF',
        strokeWidth: 3,
        marker: { enabled: false }
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'fundPct',
        yName: 'Holding Growth %',
        stroke: '#00e272',
        strokeWidth: 3,
        marker: { enabled: false }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        line: { color: '#2A2E39' },
        tick: { color: '#2A2E39' },
        gridLine: { style: [{ stroke: '#2A2E39', lineDash: [2,2] }] },
        label: { color: '#787B86', fontSize: 11 }
      },
      {
        type: 'number',
        position: 'left',
        keys: ['pricePct', 'fundPct'],
        title: { text: '' },
        gridLine: { style: [{ stroke: '#2A2E39', lineDash: [2,2] }] },
        label: {
          color: '#787B86',
          fontSize: 11,
          formatter: (p: any) => p.value == null ? '' : Number(p.value).toFixed(1) + '%'
        }
      }
    ],
    legend: { position: 'bottom', item: { label: { color: '#D1D4DC' } } },
    tooltip: { class: 'ag-chart-tooltip' }
  } as any;

  constructor(
    private timelineService: TimelineService,
    private stockService: StockService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    if (this.stockId) {
      this.loadTimeline();
    }

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.updateChartTheme(isDark);
    });
  }

  ngOnChanges(): void {
    if (this.stockId) {
      this.loadTimeline();
    }
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  loadTimeline(): void {
    if (!this.stockId) return;

    this.loading = true;
    this.error = null;

    this.timelineService.getStockTimeline(this.stockId).subscribe({
      next: (timeline: any) => {
        this.timelineData = timeline.records;
        
        if (this.symbol && this.timelineData?.timeline?.length) {
          const startDate = this.timelineData.timeline[0].date.split('T')[0];
          const endDate = this.timelineData.timeline[this.timelineData.timeline.length - 1].date.split('T')[0];
          
          this.stockService.getYfinanceStockData(this.symbol, startDate, endDate).subscribe({
            next: (yData: any) => {
              this.updateChart(yData.records);
              // Show overview tab by default (local data, no extra API call)
              this.loadDetailTab('overview');
              this.loading = false;
            },
            error: () => {
              this.updateChart();
              this.loading = false;
            }
          });
        } else {
          this.updateChart();
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to load timeline data';
        this.loading = false;
      }
    });
  }

  updateChart(yData?: Array<{DATE: string, PRICE_ON_DATE: number | null}>) {
    if (!this.timelineData || !this.timelineData.timeline) return;

    // 1. Collect all valid dates from both datasets
    const allDates = new Set<string>();
    
    // Hold raw mappings
    const fundMap = new Map<string, number>();
    const priceMap = new Map<string, number>();

    // Load Funds, discarding duplicates (last-writer wins per day)
    this.timelineData.timeline.forEach(point => {
      const dateStr = point.date.split('T')[0];
      allDates.add(dateStr);
      fundMap.set(dateStr, point.fund_count);
    });

    // Load Prices
    if (yData && yData.length) {
      yData.forEach(d => {
        if (d.PRICE_ON_DATE != null) {
          const dateStr = d.DATE.split(' ')[0];
          allDates.add(dateStr);
          priceMap.set(dateStr, d.PRICE_ON_DATE);
        }
      });
    }

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // 2. Forward-fill prices and fund counts to guarantee no nulls!
    let lastKnownPrice = Array.from(priceMap.values())[0] || 0;
    let lastKnownFund = Array.from(fundMap.values())[0] || 0;

    const filledPriceMap = new Map<string, number>();

    const mergedData = sortedDates.map(dateStr => {
      if (priceMap.has(dateStr)) lastKnownPrice = priceMap.get(dateStr)!;
      if (fundMap.has(dateStr)) lastKnownFund = fundMap.get(dateStr)!;
      
      filledPriceMap.set(dateStr, lastKnownPrice);
    
      const formattedDate = new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      return {
        date: formattedDate,
        fundCount: lastKnownFund,
        price: lastKnownPrice
      };
    });

    // 2.1 Attach exact forward-filled prices back to the raw timeline array for the HTML Table
    this.timelineData.timeline.forEach((point: any) => {
      const dateStr = point.date.split('T')[0];
      point.price = filledPriceMap.get(dateStr);
    });

    // 2.5 Calculate Percentages for Secondary Chart!
    let startPrice = mergedData.length > 0 ? mergedData[0].price : 1;
    let startFund = mergedData.length > 0 ? mergedData[0].fundCount : 1;
    if (startPrice === 0) startPrice = 1;
    if (startFund === 0) startFund = 1;

    const pctData = mergedData.map(d => ({
      date: d.date,
      pricePct: ((d.price - startPrice) / startPrice) * 100,
      fundPct: ((d.fundCount - startFund) / startFund) * 100
    }));

    // 3. Set root data and restore series 
    const currentSeries = this.chartOptions.series || [];
    const restoredSeries: any = [
      { ...currentSeries[0], data: undefined }, // line
      { ...currentSeries[1], data: undefined, type: 'bar' }  // bar
    ];

    const currentPctSeries = this.chartOptionsPct.series || [];
    const restoredPctSeries: any = [
      { ...currentPctSeries[0], data: undefined },
      { ...currentPctSeries[1], data: undefined }
    ];

    this.chartOptions = {
      ...this.chartOptions,
      data: mergedData,
      series: restoredSeries
    } as any;
    
    this.chartOptionsPct = {
      ...this.chartOptionsPct,
      data: pctData,
      series: restoredPctSeries
    } as any;
  }

  getRecentData(): TimelineDataPoint[] {
    if (!this.timelineData || !this.timelineData.timeline) return [];
    return this.showAll ? this.timelineData.timeline : this.timelineData.timeline.slice(0, 10);
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  setChartView(view: 'classic' | 'percentage'): void {
    this.activeChartView = view;
  }

  getHighestPrice(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    return Math.max(...this.timelineData.timeline.map(point => point.fund_count));
  }

  getAverageVolume(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    const totalVolume = this.timelineData.timeline.reduce((sum, point) => sum + point.fund_count, 0);
    return totalVolume / this.timelineData.timeline.length;
  }

  // Detail tab state
  activeDetailTab: string = 'overview';
  detailData: any = null;
  companyData: any = null;

  // Helper to get object keys for template iteration
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  /** Convert snake_case / camelCase keys → readable labels */
  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  /** Format values: numbers with commas, null → '—', booleans, objects as JSON */
  formatValue(val: any): string {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'number') {
      return val.toLocaleString('en-IN', { maximumFractionDigits: 4 });
    }
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  /** Return CSS class for positive/negative value colouring */
  getValueClass(key: string, val: any): string {
    if (typeof val === 'number') {
      const k = key.toLowerCase();
      if (k.includes('change') || k.includes('return') || k.includes('growth')) {
        return val >= 0 ? 'val-positive' : 'val-negative';
      }
    }
    return '';
  }

  // Load detail data for a specific tab
  loadDetailTab(tab: string): void {
    this.activeDetailTab = tab;
    let request$: any;
    switch (tab) {
      case 'history':
        // Local data — no API call needed
        this.activeDetailTab = tab;
        return;
      case 'overview':
        request$ = this.stockService.getOverview(this.symbol);
        // Also co-fetch company details to show in overview
        this.stockService.getCompany(this.symbol).subscribe({
          next: (res: any) => { this.companyData = res?.data ?? res; },
          error: () => { this.companyData = null; }
        });
        break;
      case 'price':
        request$ = this.stockService.getPrice(this.symbol);
        break;
      case 'fundamentals':
        request$ = this.stockService.getFundamentals(this.symbol);
        break;
      case 'financials':
        request$ = this.stockService.getFinancials(this.symbol);
        break;
      case 'valuation':
        request$ = this.stockService.getValuation(this.symbol);
        break;
      case 'governance':
        request$ = this.stockService.getGovernance(this.symbol);
        break;
      case 'analyst':
        request$ = this.stockService.getAnalyst(this.symbol);
        break;
      default:
        request$ = null;
    }
    if (request$) {
      request$.subscribe({
        next: (res: any) => {
          // API wraps data in { status, message, data: {...} }
          this.detailData = res?.data ?? res;
        },
        error: (err: any) => { this.detailData = { error: err.message || 'Failed to load details' }; }
      });
    }
  }

  getLowestPrice(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    return Math.min(...this.timelineData.timeline.map(point => point.fund_count));
  }








  // Update chart theme for dark/light mode
  updateChartTheme(isDark: boolean) {
    const colors = isDark ? {
      bg: '#1D2125',
      text: '#B6C2CF',
      axis: '#38414A',
      grid: '#38414A',
      label: '#8C9BAB',
    } : {
      bg: '#FFFFFF',
      text: '#172B4D',
      axis: '#DCDFE4',
      grid: '#E9EAED',
      label: '#44546F',
    };

    this.chartOptions = {
      ...this.chartOptions,
      background: { fill: colors.bg },
      title: {
        ...this.chartOptions.title as any,
        color: colors.text
      },
      axes: [
        {
          type: 'category' as const,
          position: 'bottom' as const,
          line: { color: colors.axis },
          tick: { color: colors.axis },
          gridLine: { style: [{ stroke: colors.grid }] },
          label: { color: colors.label, fontSize: 11 },
          crosshair: { stroke: colors.axis, lineDash: [4, 4] }
        },
        {
          type: 'number' as const,
          position: 'right' as const,
          keys: ['fundCount'],
          title: { text: '' },
          gridLine: { style: [{ stroke: colors.grid }] },
          label: { color: colors.label, fontSize: 11 }
        },
        {
          type: 'number' as const,
          position: 'left' as const,
          keys: ['price'],
          title: { text: '' },
          gridLine: { style: [{ stroke: colors.grid }] },
          label: { color: colors.label, fontSize: 11 }
        }
      ]
    } as AgChartOptions;

    this.chartOptionsPct = {
      ...this.chartOptionsPct,
      background: { fill: colors.bg },
      title: { ...(this.chartOptionsPct.title as any), color: colors.text },
      legend: { position: 'bottom', item: { label: { color: colors.text } } },
      axes: [
        {
          type: 'category' as const,
          position: 'bottom' as const,
          line: { color: colors.axis },
          tick: { color: colors.axis },
          gridLine: { style: [{ stroke: colors.grid, lineDash: [2, 2] }] },
          label: { color: colors.label, fontSize: 11 }
        },
        {
          type: 'number' as const,
          position: 'left' as const,
          keys: ['pricePct', 'fundPct'],
          title: { text: '' },
          gridLine: { style: [{ stroke: colors.grid, lineDash: [2, 2] }] },
          label: {
            color: colors.label, fontSize: 11,
            formatter: (p: any) => p.value == null ? '' : Number(p.value).toFixed(1) + '%'
          }
        }
      ]
    } as AgChartOptions;
  }
}
