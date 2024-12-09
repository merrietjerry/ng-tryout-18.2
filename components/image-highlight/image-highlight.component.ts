import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-highlight',
  standalone: true,
  templateUrl: './image-highlight.component.html',
  styleUrls: ['./image-highlight.component.scss'],
  imports: [HttpClientModule, CommonModule, ButtonModule],
})
export class ImageHighlightComponent implements OnInit {
  imageSrc: SafeResourceUrl | null = null;
  zoomLevel = 1;
  rotationAngle = 0;

  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadBase64Image();
  }

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.1);
  }

  rotateClockwise() {
    this.rotationAngle += 90;
  }

  rotateCounterClockwise() {
    this.rotationAngle -= 90;
  }

  reset() {
    this.zoomLevel = 1;
    this.rotationAngle = 0;
  }

  loadBase64Image() {
    const filePath = 'assets/imgData1.txt';
    this.httpClient.get(filePath, { responseType: 'text' }).subscribe({
      next: (data: string) => {
        const base64Data = data.replace(/\r?\n|\r/g, '');
        this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
          'data:image/png;base64,' + base64Data
        );
      },
      error: (err) => {
        console.error('Error loading Base64 file:', err);
      },
    });
  }
}
