import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FundService } from '../../../core/services/fund.service';
import { Fund, FundListResponse } from '../../../shared/models/fund.model';

@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.scss']
})
export class FundListComponent implements OnInit, OnDestroy {
  funds: Fund[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 0;
  pageSize: number = 20;
  totalFunds: number = 0;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  selectedDate: string | null = null;
  sortBy: string = 'holding_count';
  sortOrder: string = 'desc';
  selectedFundId: string | null = null;

  Math = Math; // Make Math available in template

  private dateFilterSubject = new Subject<string | null>();

  constructor(
    private fundService: FundService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      date: ['']
    });
  }

  ngOnInit(): void {
    // Handle query params for deep linking
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.selectedFundId = params['id'];
      }
    });

    this.loadFunds();

    // Setup debounced date filter
    this.dateFilterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(date => {
      this.selectedDate = date;
      this.currentPage = 0;
      this.loadFunds();
    });
  }

  ngOnDestroy(): void {
    this.dateFilterSubject.complete();
  }

  onTableKeydown(event: KeyboardEvent): void {
    if (!this.funds || this.funds.length === 0) return;
    const currentIdx = this.funds.findIndex(f => f._id === this.selectedFundId);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (currentIdx < this.funds.length - 1) {
        this.setSelectedFundId(this.funds[currentIdx + 1]._id);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (currentIdx > 0) {
        this.setSelectedFundId(this.funds[currentIdx - 1]._id);
      }
    }
  }

  setSelectedFundId(fundId: string): void {
    this.selectedFundId = fundId;
    // Update URL with query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: fundId },
      queryParamsHandling: 'merge'
    });
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 0;
    this.loadFunds();
  }

  onOrderChange(order: string): void {
    this.sortOrder = order;
    this.currentPage = 0;
    this.loadFunds();
  }

  loadFunds(): void {
    this.loading = true;
    this.error = null;

    const skip = this.currentPage * this.pageSize;
    const date = this.selectedDate;

    this.fundService.getAllFunds(skip, this.pageSize, date || undefined, '', this.sortBy).subscribe({
      next: (response: FundListResponse) => {
        this.funds = response.records;
        this.totalFunds = response.count;
        this.hasNextPage = (skip + this.pageSize) < response.count;
        this.loading = false;
        
        // Auto-select first fund if none selected
        if (!this.selectedFundId && this.funds.length > 0) {
          this.selectedFundId = this.funds[0]._id;
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to load funds';
        this.loading = false;
      }
    });
  }

  viewFund(fundId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.setSelectedFundId(fundId);
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadFunds();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFunds();
    }
  }

  getChangeClass(changePercent: number): string {
    if (changePercent > 0) {
      return 'text-green-600';
    } else if (changePercent < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  }

  onDateChange(): void {
    const date = this.filterForm.get('date')?.value;
    this.dateFilterSubject.next(date || null);
  }

  clearDateFilter(): void {
    this.filterForm.patchValue({ date: '' });
    this.dateFilterSubject.next(null);
  }

  getFilterSummary(): string {
    if (this.selectedDate) {
      return `Filtered by date: ${this.selectedDate}`;
    }
    return 'Showing all funds';
  }
}
