import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KioskService } from '../../services/kiosk.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
  ticket = '';
  name = '';
  department = '';

  constructor(private router: Router, private kiosk: KioskService) {}

  ngOnInit(): void {
    if (this.kiosk.selectedDepartment === null) {
      this.router.navigate(['/department']);
      return;
    }
    this.kiosk.submitCheckIn().subscribe((issued) => {
      this.ticket = issued;
      this.name = this.kiosk.patientName;
      this.department = this.kiosk.selectedDepartment?.name ?? '';
    });
  }

  printTicket(): void {
    window.print();
  }

  done(): void {
    this.kiosk.reset();
    this.router.navigate(['/']);
  }
}