import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  clock = '';
  todayLabel = '';
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateClock();
    this.todayLabel = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  private updateClock(): void {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    this.clock = hh + ':' + mm;
  }
}