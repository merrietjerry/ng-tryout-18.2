import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KeyStrokeService } from '../../services/key-stroke-renderer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doc-form',
  templateUrl: './doc-form.component.html',
  styleUrls: ['./doc-form.component.scss'],
})
export class DocFormComponent implements OnInit, OnDestroy {
  docForm!: FormGroup;
  private keySubscription!: Subscription; // Subscription to capture key events

  constructor(
    private fb: FormBuilder,
    private keyStrokeService: KeyStrokeService // Inject the KeyStrokeService
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.docForm = this.fb.group({
      field1: ['', Validators.required],
      field2: ['', Validators.required],
      field3: ['', Validators.required],
      field4: ['', Validators.required],
      field5: ['', Validators.required],
    });

    // Subscribe to key events
    this.keySubscription = this.keyStrokeService.keyEvents$.subscribe(
      ({ keyCombination, event }) => {
        console.log('Key pressed:', keyCombination, event);
      } // Pass both parameters
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.keySubscription) {
      this.keySubscription.unsubscribe();
    }
  }

  // Submit method for the form
  onSubmit(): void {
    if (this.docForm.valid) {
      console.log('Form Submitted:', this.docForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
