import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

/**
 * Renders a translation key in the active language. `pure: false` means it
 * re-evaluates on every change-detection pass, so toggling the language
 * updates the screen immediately.
 */
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: TranslationService) {}

  transform(key: string): string {
    return this.i18n.translate(key);
  }
}