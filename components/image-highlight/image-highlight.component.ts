import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as d3 from 'd3';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-highlight',
  templateUrl: './image-highlight.component.html',
  styleUrls: ['./image-highlight.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, ButtonModule],
})
export class ImageHighlightComponent implements OnInit, AfterViewInit {
  @ViewChild('svgContainer') svgContainer!: ElementRef<SVGSVGElement>;

  imageSrc: SafeResourceUrl | null = null; // Safe URL for Base64
  base64Data: string = '';
  imageWidth = 800;
  imageHeight = 600;
  zoomLevel = 1;
  rotationAngle = 0;

  filePaths = [
    'assets/imgData-1.txt',
    'assets/imgData-2.txt',
    'assets/imgData-3.txt',
  ];
  filePath = this.filePaths[0];
  highlightList = [
    { x: 210, y: 245, width: 205, height: 47, color: 'red' },
    { x: 210, y: 292, width: 205, height: 50, color: 'red' },
  ];

  highlight = this.highlightList[0];

  private zoomBehavior: any;

  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadBase64Image();
    this.setInitialZoomLevel();
  }

  ngAfterViewInit(): void {
    if (this.svgContainer) {
      this.initializeD3Zoom();
    }
  }

  loadBase64Image() {
    this.httpClient.get(this.filePath, { responseType: 'text' }).subscribe({
      next: (data: string) => {
        this.base64Data = data.replace(/\r?\n|\r/g, ''); // Clean up any newlines
      },
      error: (err) => {
        console.error('Error loading Base64 file:', err);
      },
    });
  }

  setInitialZoomLevel() {
    const containerAspect = 800 / 600;
    const imageAspect = this.imageWidth / this.imageHeight;

    if (imageAspect > containerAspect) {
      this.zoomLevel = 800 / this.imageWidth; // Fit to width
    } else {
      this.zoomLevel = 600 / this.imageHeight; // Fit to height
    }

    this.resetZoom();
  }

  initializeD3Zoom(): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);

      this.zoomBehavior = d3
        .zoom()
        .scaleExtent([0.5, 5]) // Min and max zoom levels
        .on('zoom', (event) => this.onZoom(event));

      svgElement.call(this.zoomBehavior);

      svgElement.call(
        this.zoomBehavior.transform,
        d3.zoomIdentity.translate(0, 0).scale(this.zoomLevel)
      );
    }
  }

  onZoom(event: any): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);

      // Combine zoom and rotation
      const transform = `translate(${event.transform.x}, ${
        event.transform.y
      }) scale(${event.transform.k}) rotate(${this.rotationAngle}, ${
        this.imageWidth / 2
      }, ${this.imageHeight / 2})`;

      svgElement.select('g').attr('transform', transform);
      this.zoomLevel = event.transform.k; // Update zoom level
    }
  }

  zoomIn() {
    this.applyZoom(1.1);
  }

  zoomOut() {
    this.applyZoom(0.9);
  }

  rotateClockwise() {
    this.rotationAngle += 90;
    this.applyRotation();
  }

  rotateCounterClockwise() {
    this.rotationAngle -= 90;
    this.applyRotation();
  }

  reset() {
    this.zoomLevel = 1;
    this.rotationAngle = 0;
    this.resetZoom();
  }

  resetZoom() {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);
      svgElement
        .transition()
        .call(
          this.zoomBehavior.transform,
          d3.zoomIdentity.scale(this.zoomLevel)
        );
    }
  }

  applyZoom(factor: number): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);
      this.zoomLevel *= factor;
      const transform = d3.zoomTransform(svgElement.node() as SVGSVGElement);
      svgElement
        .transition()
        .call(this.zoomBehavior.transform, transform.scale(factor));
    }
  }

  applyRotation(): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);

      // Get the current zoom transform
      const transform = d3.zoomTransform(this.svgContainer.nativeElement);

      // Combine zoom and rotation
      const combinedTransform = `translate(${transform.x}, ${
        transform.y
      }) scale(${transform.k}) rotate(${this.rotationAngle}, ${
        this.imageWidth / 2
      }, ${this.imageHeight / 2})`;

      svgElement.select('g').transition().attr('transform', combinedTransform);
    }
  }

  handleHighlight(highlightIndex: number): void {
    this.highlight = this.highlightList[highlightIndex];
  }
  handleImage(imageIndex: number): void {
    this.filePath = this.filePaths[imageIndex];
    this.ngOnInit();
  }
}
