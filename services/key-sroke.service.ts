import { Injectable, NgZone } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class KeyboardService {
  private keySubject = new Subject<string>();
  keyEvents$ = this.keySubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.initializeKeyListener();
  }

  private initializeKeyListener(): void {
    // Use NgZone to ensure Angular detects changes
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener("keydown", (event: KeyboardEvent) => {
        this.ngZone.run(() => {
          this.keySubject.next(event.key);
        });
      });
    });
  }
}
