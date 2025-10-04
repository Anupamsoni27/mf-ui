import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TimelineService } from '../../../core/services/timeline.service';
import { StockTimeline, TimelineDataPoint } from '../../../shared/models/stock.model';

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
      next: (timeline: StockTimeline) => {
        this.timelineData = timeline;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load timeline data';
        this.loading = false;
      }
    });
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