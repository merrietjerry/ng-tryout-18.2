import {
  Component,
  OnInit,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { KeyStrokeService } from '../../services/key-stroke-renderer.service';
import { KeyCombinations } from '../../constants/key-combinations.constants';

@Component({
  selector: 'app-key-listener-renderer',
  templateUrl: './doc-form-renderer.component.html',
  styleUrls: ['./doc-form-renderer.component.scss'],
})
export class DocFormRendererComponent implements OnInit, OnDestroy {
  @ViewChildren('tabFocus') tabFocusableElements!: QueryList<ElementRef>;
  @ViewChild('submitButton') submitButton!: ElementRef;
  @ViewChild('focusTrapContainer', { static: true })
  focusTrapContainer!: ElementRef;

  private keySubscription!: Subscription;
  docForm!: FormGroup;
  currentFocusIndex: number = -1;
  activeTabIndex = 0;
  activeShortcut: string = '';

  fields = [
    { id: 'field1', label: 'Field 1' },
    { id: 'field2', label: 'Field 2' },
    { id: 'field3', label: 'Field 3' },
    { id: 'field4', label: 'Field 4' },
    { id: 'field5', label: 'Field 5' },
  ];

  constructor(
    private keyStrokeService: KeyStrokeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.currentFocusIndex = this.tabFocusableElements?.length ? 0 : -1;
    this.subscribeToKeyEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribeKeyEvents();
  }

  handleSubmit(): void {
    alert('Form submitted successfully!');
  }

  onFocus(index: number): void {
    this.currentFocusIndex = index;
  }

  private initializeForm(): void {
    const controlsConfig: Record<string, any> = {};
    this.fields.forEach((field) => {
      controlsConfig[field.id] = ['', Validators.required];
    });
    this.docForm = this.fb.group(controlsConfig);
  }

  private subscribeToKeyEvents(): void {
    this.keySubscription = this.keyStrokeService.keyEvents$.subscribe(
      ({ keyCombination, event }) =>
        this.handleKeyCombination(keyCombination, event)
    );
  }

  private unsubscribeKeyEvents(): void {
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }

  private handleKeyCombination(
    keyCombination: string,
    event: KeyboardEvent
  ): void {
    const action = this.keyActions[keyCombination];
    if (action) {
      action(event);
    } else {
      console.log(`Unhandled key combination: ${keyCombination}`);
    }
  }

  private handleEnter(): void {
    const focusableArray = this.tabFocusableElements.toArray();

    if (!this.validateField()) {
      return; // Prevents focus change if validation fails
    }

    if (this.currentFocusIndex === focusableArray.length - 1) {
      if (this.submitButton) {
        this.submitButton.nativeElement.focus();
      }
      return;
    }

    if (
      this.currentFocusIndex !== -1 &&
      this.currentFocusIndex < focusableArray.length - 1
    ) {
      this.currentFocusIndex++;
      focusableArray[this.currentFocusIndex].nativeElement.focus();
    }
  }

  private validateField(): boolean {
    const focusableArray = this.tabFocusableElements.toArray();
    const currentElement =
      focusableArray[this.currentFocusIndex]?.nativeElement;
    const fieldName = currentElement?.getAttribute('formControlName');

    if (fieldName) {
      const control = this.docForm.get(fieldName);

      if (control && control.invalid) {
        control.markAsTouched();
        // Optionally use inline validation feedback instead of alert
        console.log(`Please correct errors in ${fieldName}`);
        return false;
      }
    }
    return true;
  }

  private keyActions: Record<string, (event: KeyboardEvent) => void> = {
    [KeyCombinations.CTRL_A]: () =>
      console.log('Ctrl+A: Select All Action Triggered!'),
    [KeyCombinations.CTRL_C]: () =>
      console.log('Ctrl+C: Copy Action Triggered!'),
    [KeyCombinations.CTRL_ENTER]: () =>
      console.log('Ctrl+Enter: Special Submit Action Triggered!'),
    [KeyCombinations.SHIFT_ENTER]: () =>
      console.log('Shift+Enter: New Line Action Triggered!'),
    [KeyCombinations.ALT_ENTER]: () =>
      console.log('Alt+Enter: Alternate Submit Action Triggered!'),
    [KeyCombinations.ENTER]: (event) => {
      if (this.validateField()) {
        this.handleEnter();
      }
      console.log('Enter: Default Submit Action Triggered!');
    },
    [KeyCombinations.CTRL_G]: () => this.handleCtrlG(),
    [KeyCombinations.CTRL_MINUS]: () => this.handleCtrlMinus(),
    [KeyCombinations.CTRL_PLUS]: () => this.handleCtrlPlus(),
    [KeyCombinations.CTRL_S]: () => this.handleCtrlS(),
    [KeyCombinations.CTRL_1]: () => this.handleCtrl1(),
    [KeyCombinations.CTRL_3]: () => this.handleCtrl3(),
    [KeyCombinations.CTRL_0]: () => this.handleCtrl0(),
    [KeyCombinations.CTRL_E]: () => this.handleCtrlE(),
    [KeyCombinations.CTRL_SHIFT_J]: () => this.handleCtrlShiftJ(),
    [KeyCombinations.CTRL_SHIFT_K]: () => this.handleCtrlShiftK(),

    [KeyCombinations.CTRL_5]: (event) => this.switchTab(0, event),
    [KeyCombinations.CTRL_6]: (event) => this.switchTab(1, event),
    [KeyCombinations.CTRL_7]: (event) => this.switchTab(2, event),

    [KeyCombinations.TAB]: (event) => this.handleTabNavigation(event),
  };

  private switchTab(tabIndex: number, event: KeyboardEvent): void {
    event.preventDefault();

    if (tabIndex >= 0) {
      this.activeTabIndex = tabIndex;
      console.log('tabIndex', tabIndex);
      this.focusOnTab(tabIndex);
    }
  }

  private focusOnTab(index: number): void {
    const focusableArray = this.tabFocusableElements.toArray();
    const targetElement = focusableArray[index]?.nativeElement;
    if (targetElement) {
      targetElement.focus();
    }
  }

  handleCtrlG(): void {
    this.activeShortcut = 'ctrlG';
    console.log('Ctrl + G Action Triggered');
  }

  handleCtrlMinus(): void {
    this.activeShortcut = 'ctrlMinus';
    console.log('Ctrl + - Action Triggered');
  }

  handleCtrlPlus(): void {
    this.activeShortcut = 'ctrlPlus';
    console.log('Ctrl + + Action Triggered');
  }

  handleCtrlS(): void {
    this.activeShortcut = 'ctrlS';
    console.log('Ctrl + S Action Triggered');
  }

  handleCtrl1(): void {
    this.activeShortcut = 'ctrl1';
    console.log('Ctrl + 1 Action Triggered');
  }

  handleCtrl3(): void {
    this.activeShortcut = 'ctrl3';
    console.log('Ctrl + 3 Action Triggered');
  }

  handleCtrl0(): void {
    this.activeShortcut = 'ctrl0';
    console.log('Ctrl + 0 Action Triggered');
  }

  handleCtrlE(): void {
    this.activeShortcut = 'ctrlE';
    console.log('Ctrl + E Action Triggered');
  }

  handleCtrlShiftJ(): void {
    this.activeShortcut = 'ctrlShiftJ';
    console.log('Ctrl + Shift + J Action Triggered');
  }

  handleCtrlShiftK(): void {
    this.activeShortcut = 'ctrlShiftK';
    console.log('Ctrl + Shift + K Action Triggered');
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    // console.log('HERE');
    this.rotateFocus();
  }

  private rotateFocus(): void {
    const focusableArray = this.tabFocusableElements.toArray();

    if (focusableArray.length === 0) {
      return; // No focusable elements
    }

    // Increment the currentFocusIndex and reset it to 0 if it exceeds the array length
    this.currentFocusIndex =
      (this.currentFocusIndex + 1) % focusableArray.length;

    // Set focus to the next element
    focusableArray[this.currentFocusIndex].nativeElement.focus();
  }
}
