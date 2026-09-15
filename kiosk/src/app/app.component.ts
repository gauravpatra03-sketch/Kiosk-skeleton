import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { KioskService } from './services/kiosk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  /** Return to the start screen after this much inactivity. */
  private static readonly IDLE_MS = 90000;

  private idleTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private router: Router, private kiosk: KioskService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.resetIdle();
      }
    });
    ['click', 'touchstart', 'keydown', 'mousemove'].forEach((event) =>
      window.addEventListener(event, () => this.resetIdle(), { passive: true }),
    );
    this.resetIdle();
  }

  ngOnDestroy(): void {
    if (this.idleTimer !== undefined) {
      clearTimeout(this.idleTimer);
    }
  }

  /** Return to the welcome screen (the big friendly Home button). */
  goHome(): void {
    this.router.navigate(['/']).then(() => this.resetIdle());
  }

  /** Kiosk safety: after inactivity, return to the start screen. */
  private resetIdle(): void {
    if (this.idleTimer !== undefined) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => this.goHome(), AppComponent.IDLE_MS);
  }
}