import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { StockTimeline, TimelineDataPoint } from '../../../shared/models/stock.model';
import { AgChartOptions } from 'ag-charts-community';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-timeline',
  templateUrl: './stock-timeline.component.html',
  styleUrls: ['./stock-timeline.component.scss']
})
export class StockTimelineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stockId: string = '';

  timelineData: StockTimeline | null = null;
  loading: boolean = false;
  error: string | null = null;
  showAll: boolean = false;
  private themeSubscription: Subscription | null = null;

  chartOptions: AgChartOptions = {
    background: { fill: '#131722' },
    title: {
      text: '',
      color: '#D1D4DC'
    },
    data: [],
    series: [{
      type: 'line',
      xKey: 'date',
      yKey: 'fundCount',
      yName: 'Fund Count',
      stroke: '#2962FF',
      strokeWidth: 2,
      marker: { enabled: false }
    }],
    axes: [
      {
        type: 'time',
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
  };

  constructor(
    private timelineService: TimelineService,
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
        this.updateChart();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load timeline data';
        this.loading = false;
      }
    });
  }

  updateChart() {
    if (!this.timelineData || !this.timelineData.timeline) return;
    this.chartOptions = {
      ...this.chartOptions,
      data: this.timelineData.timeline.map(point => ({
        date: new Date(point.date),
        fundCount: point.fund_count
      }))
    };
  }

  getRecentData(): TimelineDataPoint[] {
    if (!this.timelineData || !this.timelineData.timeline) return [];
    return this.showAll ? this.timelineData.timeline : this.timelineData.timeline.slice(0, 10);
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  getHighestPrice(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    return Math.max(...this.timelineData.timeline.map(point => point.fund_count));
  }

  getLowestPrice(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    return Math.min(...this.timelineData.timeline.map(point => point.fund_count));
  }

  getAverageVolume(): number {
    if (!this.timelineData || !this.timelineData.timeline || this.timelineData.timeline.length === 0) return 0;
    const totalVolume = this.timelineData.timeline.reduce((sum, point) => sum + point.fund_count, 0);
    return totalVolume / this.timelineData.timeline.length;
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
          type: 'time' as const,
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
          title: { text: '' },
          gridLine: { style: [{ stroke: colors.grid }] },
          label: { color: colors.label, fontSize: 11 }
        }
      ]
    } as AgChartOptions;
  }
}
