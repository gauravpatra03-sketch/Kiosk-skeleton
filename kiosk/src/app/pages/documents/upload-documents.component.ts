import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AttachedDocument, DocumentType, KioskService } from '../../services/kiosk.service';

/** A single upload bucket shown on the page. */
interface DocumentSlot {
  type: DocumentType;
  /** Dictionary key stem for this bucket (e.g. 'prescription'). */
  key: string;
  icon: string;
}

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css'],
})
export class UploadDocumentsComponent {
          readonly slots: DocumentSlot[] = [
    { type: 'prescription', key: 'prescription', icon: '💊' },
    { type: 'lab', key: 'lab', icon: '🧪' },
    { type: 'discharge', key: 'discharge', icon: '🏥' },
  ];

  constructor(private router: Router, private kiosk: KioskService) {}

  /** True when this screen was reached without a valid session (e.g. refresh/direct visit). */
  get needsRestart(): boolean {
    return this.kiosk.selectedDepartment === null;
  }

  /** All currently attached files for one slot. */
  filesFor(type: DocumentType): AttachedDocument[] {
    return this.kiosk.attachedDocuments.filter((d) => d.type === type);
  }

  /** Whether this slot already has at least one file. */
  hasFile(type: DocumentType): boolean {
    return this.kiosk.hasDocumentsFor(type);
  }

  /** Number of files attached across all buckets. */
  get totalAttached(): number {
    return this.kiosk.attachedDocuments.length;
  }

  /** Whether we can move on (at least one file anywhere counts). */
  get canContinue(): boolean {
    return this.kiosk.hasAnyDocument();
  }

  /** A live thumbnail preview for an image document, if one exists. */
  previewFor(doc: AttachedDocument): string | undefined {
    return doc.previewUrl;
  }

  /** Human-friendly file size (bytes -> KB/MB). */
  formatSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    }
    const kb = bytes / 1024;
    return kb < 1024 ? kb.toFixed(0) + ' KB' : (kb / 1024).toFixed(1) + ' MB';
  }

  /** Attach every file that was selected/picked for this slot. */
  private attachFiles(type: DocumentType, files: FileList | File[] | null): void {
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      this.kiosk.attachDocument(type, files[i]);
    }
  }

  /** File picker's change event. */
  onFileChosen(type: DocumentType, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.attachFiles(type, input.files ?? null);
    input.value = ''; // allow re-selecting the same file later
  }

  /** Drag over the drop zone. */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /** Drop files onto the drop zone. */
  onDrop(type: DocumentType, event: DragEvent): void {
    event.preventDefault();
    this.attachFiles(type, event.dataTransfer?.files ?? null);
  }

  remove(type: DocumentType, name: string): void {
    this.kiosk.removeDocument(type, name);
  }

  /** Continue to the queue ticket screen. */
  continue(): void {
    this.router.navigate(['/queue']);
  }

  /** Optional step — jump straight to the queue ticket screen. */
  skip(): void {
    this.router.navigate(['/queue']);
  }

  back(): void {
    this.router.navigate(['/department']);
  }

  startOver(): void {
    this.kiosk.reset();
    this.router.navigate(['/welcome']);
  }
}