import { Component, Input, ElementRef } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'app-info-icon',
  template: `
    <div class="relative inline-block group ml-2 align-middle"
         (mouseenter)="showTooltip()" 
         (mouseleave)="hideTooltip()">
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="h-4 w-4 cursor-help transition-colors duration-200"
           style="color: var(--tv-text-muted);"
           onmouseenter="this.style.color='var(--tv-blue)'"
           onmouseleave="this.style.color='var(--tv-text-muted)'"
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  `,
  styles: []
})
export class InfoIconComponent {
  @Input() tooltipText: string = '';

  constructor(
    private tooltipService: TooltipService,
    private elementRef: ElementRef
  ) {}

  showTooltip() {
    this.tooltipService.show(this.tooltipText, this.elementRef);
  }

  hideTooltip() {
    this.tooltipService.hide();
  }
}
