import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocFormRendererComponent } from './doc-form-renderer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [DocFormRendererComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
  ],
  exports: [DocFormRendererComponent],
})
export class DocFormRendererModule {}
