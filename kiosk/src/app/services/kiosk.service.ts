import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/** A clinic / department the patient can choose. */
export interface Department {
  id: string;
  name: string;
  icon: string;
  blurb: string;
}

/** Payload that would be sent to the backend. */
export interface CheckInPayload {
  name: string;
  phone: string;
  departmentId: string;
}

/**
 * Shared kiosk state + the home of the real backend calls.
 * It remembers the patient as they move through the screens and issues a
 * local ticket number. Replace the TODO sections below with real API calls
 * once the backend is ready.
 */
@Injectable()
export class KioskService {
  private static readonly DEPARTMENTS: Department[] = [
    { id: 'general', name: 'General Check-up', icon: '🩺', blurb: 'Normal check-up and follow-up' },
    { id: 'heart', name: 'Heart Clinic', icon: '❤️', blurb: 'Heart and blood pressure' },
    { id: 'bones', name: 'Bones & Joints', icon: '🦴', blurb: 'Bones, knees and joints' },
    { id: 'eye', name: 'Eye Clinic', icon: '👁️', blurb: 'Eyes and vision' },
  ];

  private static readonly TICKET_LETTERS = ['A', 'B', 'C', 'D'];
  private static ticketCounter = 1;

  patientName = '';
  patientPhone = '';
  selectedDepartment: Department | null = null;
  ticketNumber = '';

  constructor(private http: HttpClient) {}

  get departments(): Department[] {
    return [...KioskService.DEPARTMENTS];
  }

  /** Clear everything so the kiosk returns to its start screen. */
  reset(): void {
    this.patientName = '';
    this.patientPhone = '';
    this.selectedDepartment = null;
    this.ticketNumber = '';
  }

  /**
   * Simulate issuing a queue ticket (e.g. "B-042").
   * TODO: replace with the number returned by the real backend.
   */
  private issueTicketLocally(): string {
    const n = (KioskService.ticketCounter++ % 99) + 1;
    const letter =
      KioskService.TICKET_LETTERS[Math.floor(Math.random() * KioskService.TICKET_LETTERS.length)];
    this.ticketNumber = letter + '-' + String(n).padStart(3, '0');
    return this.ticketNumber;
  }

  /** Returns the desired backend base URL (empty until configured). */
  private backendBaseUrl(): string {
    // TODO: set your API root here, e.g. 'https://your-api.example.com'
    return '';
  }

  /**
   * Finish the check-in. Right now returns a locally generated ticket.
   * TODO backend wiring — when it's ready, use:
   *   const url = this.backendBaseUrl() + '/api/checkin';
   *   return this.http.post<string>(url, payload);
   */
  submitCheckIn(): Observable<string> {
    const payload: CheckInPayload = {
      name: this.patientName,
      phone: this.patientPhone,
      departmentId: this.selectedDepartment ? this.selectedDepartment.id : '',
    };
    console.log('TODO: POST /api/checkin', payload);
    return of(this.issueTicketLocally());
  }
}