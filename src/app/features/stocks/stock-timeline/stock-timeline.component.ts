import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { StockTimeline, TimelineDataPoint } from '../../../shared/models/stock.model';
import * as Highcharts from 'highcharts';
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

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: '#131722',
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif'
      },
      spacing: [10, 10, 15, 10],
      height: 400
    },
    title: {
      text: '',
      style: { color: '#D1D4DC' }
    },
    credits: { enabled: false },
    xAxis: {
      type: 'datetime',
      lineColor: '#2A2E39',
      tickColor: '#2A2E39',
      gridLineColor: '#2A2E39',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#787B86',
          fontSize: '11px'
        }
      },
      crosshair: {
        width: 1,
        color: '#2A2E39',
        dashStyle: 'Dash'
      }
    },
    yAxis: {
      opposite: true,
      title: { text: '' },
      gridLineColor: '#2A2E39',
      gridLineWidth: 1,
      labels: {
        align: 'left',
        x: 8,
        style: {
          color: '#787B86',
          fontSize: '11px'
        }
      }
    },
    tooltip: {
      backgroundColor: '#1E222D',
      borderColor: '#2A2E39',
      borderRadius: 4,
      style: {
        color: '#D1D4DC',
        fontSize: '12px'
      },
      shadow: false
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        states: { hover: { lineWidth: 2 } },
        marker: { enabled: false, states: { hover: { enabled: true, radius: 4 } } }
      }
    },
    series: [{
      type: 'line',
      name: 'Fund Count',
      data: [],
      color: '#2962FF'
    }]
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
      series: [{
        type: 'line',
        name: 'Fund Count',
        data: this.timelineData.timeline.map(point => [Date.parse(point.date), point.fund_count]),
        color: '#2962FF'
      }]
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
  // Add method to update chart theme
  updateChartTheme(isDark: boolean) {
    const colors = isDark ? {
      bg: '#1D2125',           /* Jira dark background */
      text: '#B6C2CF',         /* Jira dark text */
      axis: '#38414A',         /* Jira dark border */
      grid: '#38414A',         /* Jira dark grid */
      label: '#8C9BAB',        /* Jira secondary text */
      tooltip: '#22272B',      /* Jira dark surface */
      tooltipBorder: '#38414A', /* Jira border */
      tooltipText: '#B6C2CF',  /* Jira text */
      tooltipKey: '#8C9BAB',   /* Jira secondary */
      crosshair: '#38414A'     /* Jira border */
    } : {
      bg: '#FFFFFF',           /* Jira light background */
      text: '#172B4D',         /* Jira light text */
      axis: '#DCDFE4',         /* Jira light border */
      grid: '#E9EAED',         /* Jira light grid */
      label: '#44546F',        /* Jira secondary text */
      tooltip: '#FFFFFF',      /* White tooltip */
      tooltipBorder: '#DCDFE4', /* Jira border */
      tooltipText: '#172B4D',  /* Jira text */
      tooltipKey: '#626F86',   /* Jira muted */
      crosshair: '#DCDFE4'     /* Jira border */
    };

    // Use explicit casting or 'any' to bypass strict type checks for array union properies
    const currentXAxis = this.chartOptions.xAxis as any;
    const currentYAxis = this.chartOptions.yAxis as any;
    const currentTooltip = this.chartOptions.tooltip as any;

    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        ...this.chartOptions.chart,
        backgroundColor: colors.bg
      },
      title: {
        ...this.chartOptions.title,
        style: { color: colors.text }
      },
      xAxis: {
        ...currentXAxis,
        lineColor: colors.axis,
        tickColor: colors.axis,
        gridLineColor: colors.grid,
        labels: {
          ...currentXAxis?.labels,
          style: {
            ...currentXAxis?.labels?.style,
            color: colors.label
          }
        },
        crosshair: {
          ...currentXAxis?.crosshair,
          color: colors.crosshair
        }
      },
      yAxis: {
        ...currentYAxis,
        gridLineColor: colors.grid,
        labels: {
          ...currentYAxis?.labels,
          style: {
            ...currentYAxis?.labels?.style,
            color: colors.label
          }
        }
      },
      tooltip: {
        ...currentTooltip,
        backgroundColor: colors.tooltip,
        borderColor: colors.tooltipBorder,
        style: {
          ...currentTooltip?.style,
          color: colors.tooltipText
        },
        headerFormat: `<div style="font-size: 10px; color: ${colors.tooltipKey}; margin-bottom: 4px">{point.key}</div>`
      }
    };
  }
}
