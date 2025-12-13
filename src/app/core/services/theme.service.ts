import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkModeSubject = new BehaviorSubject<boolean>(true);
    isDarkMode$ = this.isDarkModeSubject.asObservable();

    constructor() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkModeSubject.next(savedTheme === 'dark');
        }

        // Subscribe to changes to apply class and persist
        this.isDarkMode$.subscribe(isDark => {
            document.body.classList.toggle('light-theme', !isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    isDarkMode(): boolean {
        return this.isDarkModeSubject.value;
    }

    toggleTheme() {
        this.isDarkModeSubject.next(!this.isDarkModeSubject.value);
    }

    setTheme(isDark: boolean) {
        this.isDarkModeSubject.next(isDark);
    }
}
