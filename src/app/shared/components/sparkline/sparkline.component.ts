import { Component, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TimelineDataPoint } from '../../models/stock.model';

@Component({
  selector: 'app-sparkline',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100px; height: 30px; display: block;"
    ></highcharts-chart>
  `
})
export class SparklineComponent implements OnChanges {
  @Input() timeline: TimelineDataPoint[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnChanges() {
    this.chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: undefined,
        borderWidth: 0,
        margin: [2, 0, 2, 0],
        height: 30,
        style: { overflow: 'visible' }
        // skipClone property removed - not supported in current versions
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: { visible: false },
      yAxis: { visible: false, endOnTick: false, startOnTick: false },
      tooltip: { enabled: false },
      legend: { enabled: false },
      plotOptions: {
        series: {
          color: '#3b82f6',
          lineWidth: 1,
          marker: { enabled: false }
        }
      },
      series: [{
        type: 'line',
        data: this.timeline.map(point => point.fund_count)
      }]
    };
  }
}
