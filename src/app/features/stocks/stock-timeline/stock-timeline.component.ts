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
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: {
      text: 'Stock Timeline',
      style: { color: '#cbd5e1' } // slate-300
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Date', style: { color: '#94a3b8' } }, // slate-400
      labels: { style: { color: '#94a3b8' } },
      lineColor: '#334155', // slate-700
      tickColor: '#334155'
    },
    yAxis: {
      title: { text: 'Fund Count', style: { color: '#94a3b8' } },
      labels: { style: { color: '#94a3b8' } },
      gridLineColor: '#334155' // slate-700
    },
    legend: {
      itemStyle: { color: '#cbd5e1' },
      itemHoverStyle: { color: '#fff' }
    },
    series: [{ type: 'line', name: 'Fund Count', data: [], color: '#34d399' }], // emerald-400
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
        color: '#34d399' // emerald-400
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
