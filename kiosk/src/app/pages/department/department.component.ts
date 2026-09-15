import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Department, KioskService } from '../../services/kiosk.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent {
  departments: Department[];

  constructor(private router: Router, private kiosk: KioskService) {
    this.departments = this.kiosk.departments;
  }

  choose(department: Department): void {
    this.kiosk.selectedDepartment = department;
    this.router.navigate(['/documents']);
  }

  back(): void {
    this.router.navigate(['/details']);
  }
}