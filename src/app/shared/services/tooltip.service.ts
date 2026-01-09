import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TooltipState {
  isVisible: boolean;
  text: string;
  position: { top: number; left: number };
}

@Injectable({
  providedIn: 'root'
})
export class TooltipService {
  private stateSubject = new BehaviorSubject<TooltipState>({
    isVisible: false,
    text: '',
    position: { top: 0, left: 0 }
  });

  state$ = this.stateSubject.asObservable();

  show(text: string, elementRef: ElementRef) {
    const rect = elementRef.nativeElement.getBoundingClientRect();
    
    // Calculate center position above the element
    // 5px offset above the element
    const top = rect.top - 10; 
    const left = rect.left + (rect.width / 2);

    this.stateSubject.next({
      isVisible: true,
      text,
      position: { top, left }
    });
  }

  hide() {
    this.stateSubject.next({
      ...this.stateSubject.value,
      isVisible: false
    });
  }
}
