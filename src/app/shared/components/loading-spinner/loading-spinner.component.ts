import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex justify-center items-center" [class]="containerClass">
      <div class="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" 
           [class]="spinnerClass"></div>
      <span *ngIf="showText" class="ml-2 text-gray-600">{{ text }}</span>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showText: boolean = false;
  @Input() text: string = 'Loading...';
  @Input() containerClass: string = '';

  get spinnerClass(): string {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return sizeClasses[this.size];
  }
}
