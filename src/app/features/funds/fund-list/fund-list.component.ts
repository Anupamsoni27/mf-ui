import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FundService } from '../../../core/services/fund.service';
import { Fund, FundListResponse } from '../../../shared/models/fund.model';

@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.scss']
})
export class FundListComponent implements OnInit {
  funds: Fund[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalFunds: number = 0;
  hasNextPage: boolean = false;
  filterForm: FormGroup;
  selectedDate: string | null = null;
  sortBy: string = 'holding_count';
  sortOrder: string = 'desc';

  Math = Math; // Make Math available in template

  constructor(
    private fundService: FundService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      date: ['']
    });
  }

  ngOnInit(): void {
    this.loadFunds();
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
    this.router.navigate(['/funds', fundId]);
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
    this.selectedDate = this.filterForm.get('date')?.value;
    this.currentPage = 0; // Reset to first page when filtering
    this.loadFunds();
  }

  clearDateFilter(): void {
    this.filterForm.patchValue({ date: '' });
    this.selectedDate = null;
    this.currentPage = 0; // Reset to first page when clearing filter
    this.loadFunds();
  }

  getFilterSummary(): string {
    if (this.selectedDate) {
      return `Filtered by date: ${this.selectedDate}`;
    }
    return 'Showing all funds';
  }
}
