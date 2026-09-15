import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KioskService } from '../../services/kiosk.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  name = '';
  phone = '';
  attempted = false;

  constructor(private router: Router, private kiosk: KioskService) {
    this.name = this.kiosk.patientName;
    this.phone = this.kiosk.patientPhone;
  }

  hasInputError(): boolean {
    if (!this.attempted) {
      return false;
    }
    const nameOk = this.name.trim().length > 0;
    const phoneOk = /^\d{10}$/.test(this.phone);
    return !nameOk || !phoneOk;
  }

  /** Keep only digits in the phone field, maximum 10. */
  onPhoneInput(): void {
    const clean = this.phone.replace(/\D/g, '');
    this.phone = clean.length > 10 ? clean.slice(0, 10) : clean;
  }

  next(): void {
    this.attempted = true;
    if (this.hasInputError()) {
      return;
    }
    this.kiosk.patientName = this.name.trim();
    this.kiosk.patientPhone = this.phone;
    this.router.navigate(['/department']);
  }

  back(): void {
    this.router.navigate(['/']);
  }
}