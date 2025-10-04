import { Component, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-fund-timeline-chart',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 400px; display: block;"
    ></highcharts-chart>
  `
})
export class FundTimelineChartComponent implements OnChanges {
  @Input() timeline: { date: string, value: number }[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: { text: 'Fund Timeline' },
    xAxis: { type: 'datetime', title: { text: 'Date' } },
    yAxis: { title: { text: 'Value' } },
    series: [{
      type: 'line',
      name: 'Value',
      data: []
    }],
    credits: { enabled: false }
  };

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        type: 'line',
        name: 'Value',
        data: this.timeline.map(point => [Date.parse(point.date), point.value])
      }]
    };
  }
}
