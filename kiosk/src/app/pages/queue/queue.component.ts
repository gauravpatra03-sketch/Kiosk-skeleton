import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KioskService } from '../../services/kiosk.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit, OnDestroy {
  ticket = '';
  name = '';
  department = '';
  nowLabel = '';
  private autoPrinted = false;
  private printTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private router: Router, private kiosk: KioskService, private i18n: TranslationService) {}

  /** True when this screen was reached without a valid session (e.g. refresh/direct visit). */
  get needsRestart(): boolean {
    return this.kiosk.selectedDepartment === null;
  }

  ngOnInit(): void {
    if (this.needsRestart) {
      return;
    }
    const locale = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-IN';
    this.nowLabel = new Date().toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    this.kiosk.submitCheckIn().subscribe((issued) => {
      this.ticket = issued;
      this.name = this.kiosk.patientName;
      this.department = this.kiosk.selectedDepartment?.name ?? '';
      this.autoPrintOnce();
    });
  }

  ngOnDestroy(): void {
    if (this.printTimer !== undefined) {
      clearTimeout(this.printTimer);
    }
  }

  /** Fire the print dialog once, shortly after the ticket appears (like a real printer). */
  private autoPrintOnce(): void {
    if (this.autoPrinted) {
      return;
    }
    this.autoPrinted = true;
    this.printTimer = setTimeout(() => window.print(), 250);
  }

  printTicket(): void {
    window.print();
  }

  done(): void {
    this.kiosk.reset();
    this.router.navigate(['/']);
  }

  startOver(): void {
    this.kiosk.reset();
    this.router.navigate(['/welcome']);
  }
}