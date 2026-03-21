import { Component } from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';

@Component({
  selector: 'app-tooltip',
  template: `
    <div *ngIf="(tooltipService.state$ | async) as state"
         [class.opacity-100]="state.isVisible"
         [class.opacity-0]="!state.isVisible"
         [class.visible]="state.isVisible"
         [class.invisible]="!state.isVisible"
         class="fixed transition-opacity duration-200 z-[9999] pointer-events-none"
         [style.top.px]="state.position.top"
         [style.left.px]="state.position.left">
      <div class="px-3 py-2 rounded-lg shadow-lg border transform -translate-x-1/2 -translate-y-full whitespace-nowrap"
           style="background-color: var(--tv-bg-dark); border-color: var(--tv-border); color: var(--tv-text-primary);">
        {{ state.text }}
        <!-- Arrow -->
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent"
             style="border-top-color: var(--tv-bg-dark);"></div>
      </div>
    </div>
  `,
  styles: []
})
export class TooltipComponent {
  constructor(public tooltipService: TooltipService) {}
}
