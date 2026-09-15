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

/** The three document kinds a patient can attach before consultation. */
export type DocumentType = 'prescription' | 'lab' | 'discharge';

/** A patient-attached document. `previewUrl` is only available in the live
 *  session (browser object URLs can't survive a refresh). */
export interface AttachedDocument {
  type: DocumentType;
  file: File;
  previewUrl?: string;
}

/** A serializable slice of an attached document, used to persist across refresh. */
interface PersistedDoc {
  type: DocumentType;
  name: string;
  size: number;
  lastModified: number;
}

/**
 * Shared kiosk state + the home of the real backend calls.
 * It remembers the patient as they move through the screens and issues a
 * local ticket number. Replace the TODO sections below with real API calls
 * once the backend is ready.
 */
@Injectable()
export class KioskService {
  private static readonly STORAGE_KEY = 'kiosk-state-v1';

  private static readonly DEPARTMENTS: Department[] = [
    { id: 'general', name: 'General Check-up', icon: '🩺', blurb: 'Normal check-up and follow-up' },
    { id: 'heart', name: 'Heart Clinic', icon: '❤️', blurb: 'Heart and blood pressure' },
    { id: 'bones', name: 'Bones & Joints', icon: '🦴', blurb: 'Bones, knees and joints' },
    { id: 'eye', name: 'Eye Clinic', icon: '👁️', blurb: 'Eyes and vision' },
  ];

  private static readonly TICKET_LETTERS = ['A', 'B', 'C', 'D'];
  private static ticketCounter = 1;

  private _patientName = '';
  private _patientPhone = '';
  private _selectedDepartment: Department | null = null;
  private _ticketNumber = '';
  private _attachedDocuments: AttachedDocument[] = [];

  constructor(private http: HttpClient) {
    this.loadState();
  }

  get patientName(): string {
    return this._patientName;
  }
  set patientName(value: string) {
    this._patientName = value;
    this.persist();
  }

  get patientPhone(): string {
    return this._patientPhone;
  }
  set patientPhone(value: string) {
    this._patientPhone = value;
    this.persist();
  }

  get selectedDepartment(): Department | null {
    return this._selectedDepartment;
  }
  set selectedDepartment(value: Department | null) {
    this._selectedDepartment = value;
    this.persist();
  }

  get ticketNumber(): string {
    return this._ticketNumber;
  }
  set ticketNumber(value: string) {
    this._ticketNumber = value;
    this.persist();
  }

  get attachedDocuments(): AttachedDocument[] {
    return this._attachedDocuments;
  }

  get departments(): Department[] {
    return [...KioskService.DEPARTMENTS];
  }

  /** Clear everything so the kiosk returns to its start screen. */
  reset(): void {
    this._attachedDocuments.forEach((d) => {
      if (d.previewUrl) {
        URL.revokeObjectURL(d.previewUrl);
      }
    });
    this._patientName = '';
    this._patientPhone = '';
    this._selectedDepartment = null;
    this._ticketNumber = '';
    this._attachedDocuments = [];
    if (this.persistSupported()) {
      window.sessionStorage.removeItem(KioskService.STORAGE_KEY);
    }
  }

  /** Add an attached file for the given document type. */
  attachDocument(type: DocumentType, file: File): void {
    const previewUrl = this.isPreviewable(file) ? URL.createObjectURL(file) : undefined;
    this._attachedDocuments = [...this._attachedDocuments, { type, file, previewUrl }];
    this.persist();
  }

  /** Remove one attached file (matched by type + name). */
  removeDocument(type: DocumentType, name: string): void {
    this._attachedDocuments
      .filter((d) => d.type === type && d.file.name === name)
      .forEach((d) => {
        if (d.previewUrl) {
          URL.revokeObjectURL(d.previewUrl);
        }
      });
    this._attachedDocuments = this._attachedDocuments.filter(
      (d) => !(d.type === type && d.file.name === name),
    );
    this.persist();
  }

  /** Whether at least one document of the given type is attached. */
  hasDocumentsFor(type: DocumentType): boolean {
    return this._attachedDocuments.some((d) => d.type === type);
  }

  /** Whether at least one document of any type is attached. */
  hasAnyDocument(): boolean {
    return this._attachedDocuments.length > 0;
  }

  /** True when we can show a live thumbnail for a file. */
  isPreviewable(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Finish the check-in. Issues a single stable ticket per session (persisted,
   * so a refresh keeps the same number).
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
    if (this._ticketNumber === '') {
      this._ticketNumber = this.issueTicketLocally();
      this.persist();
    }
    return of(this._ticketNumber);
  }

  /** Simulate issuing a ticket (e.g. "B-042"). No persistence here — the caller owns it. */
  private issueTicketLocally(): string {
    const n = (KioskService.ticketCounter++ % 99) + 1;
    const letter =
      KioskService.TICKET_LETTERS[Math.floor(Math.random() * KioskService.TICKET_LETTERS.length)];
    return letter + '-' + String(n).padStart(3, '0');
  }

  /** Returns the desired backend base URL (empty until configured). */
  private backendBaseUrl(): string {
    // TODO: set your API root here, e.g. 'https://your-api.example.com'
    return '';
  }

  /** True only when sessionStorage is actually usable. */
  private persistSupported(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.sessionStorage;
    } catch {
      return false;
    }
  }

  /** Write the whole journey to sessionStorage so a refresh keeps it. */
  private persist(): void {
    if (!this.persistSupported()) {
      return;
    }
    const data = {
      name: this._patientName,
      phone: this._patientPhone,
      departmentId: this._selectedDepartment ? this._selectedDepartment.id : null,
      ticket: this._ticketNumber,
      docs: this._attachedDocuments.map<PersistedDoc>((d) => ({
        type: d.type,
        name: d.file.name,
        size: d.file.size,
        lastModified: d.file.lastModified,
      })),
    };
    try {
      window.sessionStorage.setItem(KioskService.STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage may be full — the journey simply won't survive a refresh */
    }
  }

  /** Rebuild in-memory state from sessionStorage (if any). */
  private loadState(): void {
    if (!this.persistSupported()) {
      return;
    }
    let raw: string | null = null;
    try {
      raw = window.sessionStorage.getItem(KioskService.STORAGE_KEY);
    } catch {
      return;
    }
    if (!raw) {
      return;
    }
    let data: {
      name?: string;
      phone?: string;
      departmentId?: string | null;
      ticket?: string;
      docs?: PersistedDoc[];
    } | null = null;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }
    if (!data) {
      return;
    }
    // const alias so closures (e.g. the .find callback) see non-null state
    const state = data;
    this._patientName = state.name ?? '';
    this._patientPhone = state.phone ?? '';
    const department = KioskService.DEPARTMENTS.find((d) => d.id === state.departmentId);
    this._selectedDepartment = department ?? null;
    this._ticketNumber = state.ticket ?? '';
    this._attachedDocuments = (state.docs ?? []).map((m) => ({
      type: m.type,
      // File bytes don't survive storage; keep a display-only stand-in.
      file: { name: m.name, size: m.size, lastModified: m.lastModified } as unknown as File,
      previewUrl: undefined,
    }));
  }
}