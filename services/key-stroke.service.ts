import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyStrokeService implements OnDestroy {
  private keySubject = new Subject<string>();
  keyEvents$ = this.keySubject.asObservable();
  private keyListener!: (event: KeyboardEvent) => void;

  constructor(private ngZone: NgZone) {
    this.initializeKeyListener();
  }

  private initializeKeyListener(): void {
    if (typeof window !== 'undefined') {
      this.keyListener = (event: KeyboardEvent) => {
        this.ngZone.run(() => {
          if (event.ctrlKey && event.key === 'a') {
            this.keySubject.next('Ctrl+A');
          } else if (event.ctrlKey && event.key === 'c') {
            this.keySubject.next('Ctrl+C');
          } else if (event.ctrlKey && event.key === 'Enter') {
            this.keySubject.next('Ctrl+Enter');
          } else if (event.shiftKey && event.key === 'Enter') {
            this.keySubject.next('Shift+Enter');
          } else if (event.altKey && event.key === 'Enter') {
            this.keySubject.next('Alt+Enter');
          } else if (event.key === 'Enter') {
            this.keySubject.next('Enter');
          }
        });
      };

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('keydown', this.keyListener);
      });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.keyListener) {
      window.removeEventListener('keydown', this.keyListener);
    }
  }
}
