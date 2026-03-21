import { Component, Input, OnChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-fund-timeline-chart',
  template: `
    <ag-charts-angular
      [options]="chartOptions"
      style="width: 100%; height: 400px; display: block;"
    ></ag-charts-angular>
  `
})
export class FundTimelineChartComponent implements OnChanges {
  @Input() timeline: { date: string, value: number }[] = [];

  chartOptions: AgChartOptions = {
    title: { text: 'Fund Timeline' },
    data: [],
    series: [{
      type: 'line',
      xKey: 'date',
      yKey: 'value',
      yName: 'Value'
    }],
    axes: [
      { type: 'time', position: 'bottom', title: { text: 'Date' } },
      { type: 'number', position: 'left', title: { text: 'Value' } }
    ]
  };

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions = {
      ...this.chartOptions,
      data: this.timeline.map(point => ({
        date: new Date(point.date),
        value: point.value
      }))
    };
  }
}
