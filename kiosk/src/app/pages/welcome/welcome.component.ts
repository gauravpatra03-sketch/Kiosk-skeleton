import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  clock = '';
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private router: Router, private i18n: TranslationService) {}

  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 30000);
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  start(): void {
    this.router.navigate(['/details']);
  }

  /** Today's date, formatted in the selected language's locale. */
  dateLabel(): string {
    const locale = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-IN';
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private updateClock(): void {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    this.clock = hh + ':' + mm;
  }
}