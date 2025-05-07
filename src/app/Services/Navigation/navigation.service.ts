import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.history = [...this.history, event.urlAfterRedirects];
      });

    // Add the initial URL if the user navigated directly
    const initialUrl = this.router.url;
    this.history.push(initialUrl);
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string | undefined {
    return this.history.length > 1 ? this.history[this.history.length - 2] : undefined;
  }
}
