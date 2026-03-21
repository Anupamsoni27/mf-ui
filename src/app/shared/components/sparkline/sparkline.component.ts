import { Component, Input, OnChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { TimelineDataPoint } from '../../models/stock.model';

@Component({
  selector: 'app-sparkline',
  template: `
    <ag-charts-angular
      [options]="chartOptions"
      style="width: 100px; height: 30px; display: block;"
    ></ag-charts-angular>
  `
})
export class SparklineComponent implements OnChanges {
  @Input() timeline: TimelineDataPoint[] = [];
  chartOptions: AgChartOptions = {};

  ngOnChanges() {
    this.chartOptions = {
      data: this.timeline.map((point, index) => ({
        index,
        value: point.fund_count
      })),
      series: [{
        type: 'line',
        xKey: 'index',
        yKey: 'value',
        stroke: '#2962FF',
        strokeWidth: 1,
        marker: { enabled: false }
      }],
      axes: [
        { type: 'number', position: 'bottom', label: { enabled: false }, line: { enabled: false }, tick: { enabled: false }, gridLine: { enabled: false } },
        { type: 'number', position: 'left', label: { enabled: false }, line: { enabled: false }, tick: { enabled: false }, gridLine: { enabled: false } }
      ],
      legend: { enabled: false },
      padding: { top: 2, right: 0, bottom: 2, left: 0 },
      background: { visible: false },
      tooltip: { enabled: false }
    };
  }
}
