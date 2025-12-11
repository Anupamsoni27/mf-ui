import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
    selector: 'app-notification',
    template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <div *ngFor="let notification of notifications" 
           [@slideIn]
           [class]="getNotificationClasses(notification.type)"
           class="px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 min-w-[300px]">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg *ngIf="notification.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="notification.type === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="notification.type === 'warning'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="notification.type === 'info'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <!-- Message -->
        <div class="flex-1 text-sm font-medium">
          {{ notification.message }}
        </div>
      </div>
    </div>
  `,
    styles: [],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class NotificationComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    private subscription?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.subscription = this.notificationService.notifications$.subscribe(notification => {
            this.notifications.push(notification);

            // Auto-dismiss after duration
            if (notification.duration) {
                setTimeout(() => {
                    this.removeNotification(notification.id);
                }, notification.duration);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    getNotificationClasses(type: Notification['type']): string {
        const baseClasses = 'backdrop-blur-sm';

        const typeClasses = {
            success: 'bg-emerald-900/90 border-emerald-700 text-emerald-100',
            error: 'bg-red-900/90 border-red-700 text-red-100',
            warning: 'bg-yellow-900/90 border-yellow-700 text-yellow-100',
            info: 'bg-blue-900/90 border-blue-700 text-blue-100'
        };

        return `${baseClasses} ${typeClasses[type]}`;
    }
}
