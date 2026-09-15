import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { KioskService } from './services/kiosk.service';
import { Language, TranslationService } from './i18n/translation.service';

/** A step shown in the header's progress bar. */
interface KioskStep {
  path: string;
  labelKey: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  /** Return to the start screen after this much inactivity. */
  private static readonly IDLE_MS = 90000;

  /** The journey in order — used to highlight the current step in the header. */
  private static readonly STEPS: KioskStep[] = [
    { path: '/welcome', labelKey: 'header.step.start', icon: '🏠' },
    { path: '/details', labelKey: 'header.step.details', icon: '👤' },
    { path: '/department', labelKey: 'header.step.clinic', icon: '🏥' },
    { path: '/documents', labelKey: 'header.step.documents', icon: '📄' },
    { path: '/queue', labelKey: 'header.step.queue', icon: '🎟️' },
  ];

  private idleTimer: ReturnType<typeof setTimeout> | undefined;

  /** Current interface language (drives the EN | हिं toggle). */
  get lang(): Language {
    return this.i18n.lang;
  }

  /** Steps shown in the header. */
  steps: KioskStep[] = AppComponent.STEPS;

  /** Index into `steps` of the page we are currently on (-1 = none). */
  activeStep = -1;

  constructor(private router: Router, private kiosk: KioskService, private i18n: TranslationService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.resetIdle();
      }
      if (event instanceof NavigationEnd) {
        this.activeStep = this.steps.findIndex((s) => event.url.startsWith(s.path));
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

  /** Switch the interface language. */
  setLang(lang: Language): void {
    this.i18n.setLang(lang);
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