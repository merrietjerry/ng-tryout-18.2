import { Injectable, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyStrokeService {
  private keySubject = new Subject<string>();
  keyEvents$ = this.keySubject.asObservable();

  constructor() {}

  // Use @HostListener to listen for document-wide keydown events
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const keyCombination = this.getKeyCombination(event);
    if (keyCombination) {
      this.keySubject.next(keyCombination);
    }
  }

  private getKeyCombination(event: KeyboardEvent): string | null {
    if (event.ctrlKey && event.key === 'a') {
      return 'Ctrl+A';
    } else if (event.ctrlKey && event.key === 'c') {
      return 'Ctrl+C';
    } else if (event.ctrlKey && event.key === 'Enter') {
      return 'Ctrl+Enter';
    } else if (event.shiftKey && event.key === 'Enter') {
      return 'Shift+Enter';
    } else if (event.altKey && event.key === 'Enter') {
      return 'Alt+Enter';
    } else if (event.key === 'Enter') {
      return 'Enter';
    }
    return null; // No recognized key combination
  }
}
