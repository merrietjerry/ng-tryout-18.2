import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
interface Highlight {
  x: number;
  y: number;
  width: number;
  height: number;
  drawing: boolean;
}

@Component({
  selector: 'app-image-viewer-sv',
  standalone: true,
  templateUrl: './image-viewer-sv.component.html',
  styleUrls: ['./image-viewer-sv.component.scss'],
  imports: [HttpClientModule, CommonModule, ButtonModule],
})
export class ImageViewerSvComponent implements OnInit {
  imageSrc: SafeResourceUrl | null = null;
  zoomLevel = 1;
  rotationAngle = 0;
  highlights: Highlight[] = [];
  isDrawing = false;
  startX = 0;
  startY = 0;
  currentHighlight: Highlight | null = null;

  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadBase64Image();
    // this.highlights = [
    //   { x: 50, y: 50, width: 100, height: 100 },
    //   { x: 200, y: 150, width: 80, height: 120 },
    // ];
  }

  // Zoom and Rotate
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
    this.highlights = [];
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault(); // Prevent default drag behavior
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.highlights = [];
    this.currentHighlight = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: 0,
      height: 0,
      drawing: true,
    };
  }

  onMouseMove(event: MouseEvent): void {
    if (this.currentHighlight?.drawing) {
      event.preventDefault(); // Prevent default drag behavior
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.currentHighlight.width =
        event.clientX - rect.left - this.currentHighlight.x;
      this.currentHighlight.height =
        event.clientY - rect.top - this.currentHighlight.y;
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.currentHighlight?.drawing) {
      this.currentHighlight.drawing = false;
      this.highlights.push({ ...this.currentHighlight });
      this.currentHighlight = null;
      event.preventDefault(); // Prevent default drag behavior
    }
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
