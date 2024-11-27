import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocFormModule } from '../components/doc-form/doc-form.module';
import { DocFormRendererModule } from '../components/doc-form-renderer/doc-form-renderer.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DocFormModule, DocFormRendererModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-poc';
}
