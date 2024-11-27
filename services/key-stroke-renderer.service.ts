import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { KeyCombinations } from '../constants/key-combinations.constants';

@Injectable({
  providedIn: 'root',
})
export class KeyStrokeService {
  private keySubject = new Subject<{
    keyCombination: string;
    event: KeyboardEvent;
  }>(); // Emitting both keyCombination and event
  keyEvents$ = this.keySubject.asObservable().pipe(debounceTime(10));
  private renderer: Renderer2;
  private detectionEnabled = true;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeKeyListener();
  }

  private initializeKeyListener(): void {
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      if (this.detectionEnabled) {
        const keyCombination = this.detectKeyCombination(event);
        if (keyCombination) {
          this.keySubject.next({ keyCombination, event });
        }
      }
    });
  }

  private detectKeyCombination(event: KeyboardEvent): string | null {
    const target = event.target as HTMLElement;
    console.log(target.tagName);
    const isInputElement = ['INPUT', 'TEXTAREA'].includes(target.tagName);

    // Ignore Enter key for non-input elements
    if (!isInputElement && event.key === 'Enter') {
      return null;
    }
    return this.mapKeyCombination(event);
  }

  private mapKeyCombination(event: KeyboardEvent): string | null {
    console.log('EVENT', event);
    if (event.ctrlKey && event.key === 'a') {
      event.preventDefault();
      return KeyCombinations.CTRL_A;
    } else if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      return KeyCombinations.CTRL_C;
    } else if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      return KeyCombinations.CTRL_ENTER;
    } else if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      return KeyCombinations.SHIFT_ENTER;
    } else if (event.altKey && event.key === 'Enter') {
      event.preventDefault();
      return KeyCombinations.ALT_ENTER;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      return KeyCombinations.ENTER;
    } else if (event.key === 'Tab') {
      event.preventDefault();
      return KeyCombinations.TAB;
    } else if (event.ctrlKey && event.key === 'g') {
      event.preventDefault();
      return KeyCombinations.CTRL_G;
    } else if (event.ctrlKey && event.key === '-') {
      event.preventDefault();
      return KeyCombinations.CTRL_MINUS;
    } else if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
      event.preventDefault();
      return KeyCombinations.CTRL_PLUS;
    } else if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      return KeyCombinations.CTRL_S;
    } else if (event.ctrlKey && event.key === '1') {
      event.preventDefault();
      return KeyCombinations.CTRL_1;
    } else if (event.ctrlKey && event.key === '3') {
      event.preventDefault();
      return KeyCombinations.CTRL_3;
    } else if (event.ctrlKey && event.key === '0') {
      event.preventDefault();
      return KeyCombinations.CTRL_0;
    } else if (event.ctrlKey && event.key === 'e') {
      event.preventDefault();
      return KeyCombinations.CTRL_E;
    } else if (
      event.ctrlKey &&
      event.shiftKey &&
      event.key.toLowerCase() === 'j'
    ) {
      event.preventDefault();
      return KeyCombinations.CTRL_SHIFT_J;
    } else if (
      event.ctrlKey &&
      event.shiftKey &&
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();
      return KeyCombinations.CTRL_SHIFT_K;
    } else if (event.ctrlKey && event.key === '5') {
      event.preventDefault();
      return KeyCombinations.CTRL_5; // For the first tab
    } else if (event.ctrlKey && event.key === '6') {
      event.preventDefault();
      return KeyCombinations.CTRL_6; // For the second tab
    } else if (event.ctrlKey && event.key === '7') {
      event.preventDefault();
      return KeyCombinations.CTRL_7; // For the third tab
    }

    return null;
  }

  enableDetection(): void {
    this.detectionEnabled = true;
  }

  disableDetection(): void {
    this.detectionEnabled = false;
  }
}
