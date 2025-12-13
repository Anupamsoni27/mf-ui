import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TimelineService } from '../../../core/services/timeline.service';
import { StockTimeline, TimelineDataPoint } from '../../../shared/models/stock.model';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-stock-timeline',
  templateUrl: './stock-timeline.component.html',
  styleUrls: ['./stock-timeline.component.scss']
})
export class StockTimelineComponent implements OnInit, OnChanges {
  @Input() stockId: string = '';

  timelineData: StockTimeline | null = null;
  loading: boolean = false;
  error: string | null = null;
  showAll: boolean = false;

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
    xAxis: {
      type: 'datetime',
      title: { text: '' },
      labels: {
        style: {
          color: '#787B86',
          fontSize: '11px'
        }
      },
      lineColor: '#2A2E39',
      tickColor: '#2A2E39',
      gridLineColor: '#2A2E39',
      gridLineWidth: 1
    },
    yAxis: {
      title: {
        text: 'Fund Count',
        style: {
          color: '#787B86',
          fontSize: '11px'
        }
      },
      labels: {
        style: {
          color: '#787B86',
          fontSize: '11px'
        },
        align: 'left',
        x: 5,
        y: -2
      },
      gridLineColor: '#2A2E39',
      gridLineWidth: 1,
      opposite: true
    },
    legend: {
      enabled: false
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
        states: {
          hover: {
            lineWidth: 2
          }
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4
            }
          }
        }
      }
    },
    series: [{
      type: 'line',
      name: 'Fund Count',
      data: [],
      color: '#2962FF'
    }],
    credits: { enabled: false }
  };

  constructor(private timelineService: TimelineService) { }

  ngOnInit(): void {
    if (this.stockId) {
      this.loadTimeline();
    }
  }

  ngOnChanges(): void {
    if (this.stockId) {
      this.loadTimeline();
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
        color: '#2962FF' // TradingView blue
      }]
    };
  }

  getRecentData(): TimelineDataPoint[] {
    if (!this.timelineData || !this.timelineData.timeline) return [];

    if (this.showAll) {
      return this.timelineData.timeline;
    }

    return this.timelineData.timeline.slice(0, 10);
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
}
