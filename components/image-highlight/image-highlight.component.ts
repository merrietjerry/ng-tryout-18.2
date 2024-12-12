import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as d3 from 'd3';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  fetchBase64Image(filePath: string): Observable<string> {
    return this.httpClient.get(filePath, { responseType: 'text' }).pipe(
      map((data: string) => data.replace(/\r?\n|\r/g, '')),
      catchError((err) => {
        console.error('Error loading Base64 file:', err);
        return of('');
      })
    );
  }
}

@Component({
  selector: 'app-image-highlight',
  templateUrl: './image-highlight.component.html',
  styleUrls: ['./image-highlight.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, SplitterModule, HttpClientModule],
  providers: [ImageService],
})
export class ImageHighlightComponent implements OnInit, AfterViewInit {
  @ViewChild('svgContainer') svgContainer!: ElementRef<SVGSVGElement>;

  private readonly ZOOM_EXTENT: [number, number] = [0.5, 5];

  imageProperties = {
    src: null as SafeResourceUrl | null,
    base64Data: '',
    width: 800,
    height: 600,
  };

  transformations = {
    zoomLevel: 1,
    rotationAngle: 0,
  };

  highlightList = [
    { x: 210, y: 245, width: 205, height: 47, color: 'red' },
    { x: 210, y: 440, width: 205, height: 50, color: 'red' },
  ];

  filePaths = [
    'assets/imgData-1.txt',
    'assets/imgData-2.txt',
    'assets/imgData-3.txt',
  ];

  currentHighlight = this.highlightList[0];
  filePath = this.filePaths[0];

  private zoomBehavior: any;

  constructor(
    private imageService: ImageService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    this.setupD3Zoom();
  }

  private initializeComponent(): void {
    this.loadBase64Image();
    this.setInitialZoomLevel();
  }

  private setupD3Zoom(): void {
    if (this.svgContainer) {
      this.zoomBehavior = d3
        .zoom()
        .scaleExtent(this.ZOOM_EXTENT)
        .on('zoom', this.onZoom.bind(this));

      const svgElement = d3.select(this.svgContainer.nativeElement);

      svgElement.call(this.zoomBehavior);

      svgElement.call(
        this.zoomBehavior.transform,
        d3.zoomIdentity.translate(0, 0).scale(this.transformations.zoomLevel)
      );
    }
  }

  loadBase64Image(): void {
    this.imageService.fetchBase64Image(this.filePath).subscribe((data) => {
      this.imageProperties.base64Data = data;
    });
  }

  private setInitialZoomLevel(): void {
    const containerAspect = 800 / 600;
    const imageAspect =
      this.imageProperties.width / this.imageProperties.height;

    if (imageAspect > containerAspect) {
      this.transformations.zoomLevel = 800 / this.imageProperties.width;
    } else {
      this.transformations.zoomLevel = 600 / this.imageProperties.height;
    }

    this.resetZoom();
  }

  private onZoom(event: any): void {
    if (this.svgContainer) {
      const combinedTransform = this.getCombinedTransform(event.transform);
      d3.select(this.svgContainer.nativeElement)
        .select('g')
        .attr('transform', combinedTransform);

      this.transformations.zoomLevel = event.transform.k;
      this.updateHighlights();
    }
  }

  private getCombinedTransform(transform: any): string {
    return `translate(${transform.x}, ${transform.y}) scale(${
      transform.k
    }) rotate(${this.transformations.rotationAngle}, ${
      this.imageProperties.width / 2
    }, ${this.imageProperties.height / 2})`;
  }

  private updateHighlights(): void {
    const highlights = d3
      .select(this.svgContainer.nativeElement)
      .selectAll('rect')
      .data(this.highlightList);

    highlights
      .attr('x', (d) => d.x * this.transformations.zoomLevel)
      .attr('y', (d) => d.y * this.transformations.zoomLevel)
      .attr('width', (d) => d.width * this.transformations.zoomLevel)
      .attr('height', (d) => d.height * this.transformations.zoomLevel)
      .attr('fill', (d) => d.color)
      .attr('opacity', 0.5);
  }

  zoomIn(): void {
    this.applyZoom(1.1);
  }

  zoomOut(): void {
    this.applyZoom(0.9);
  }

  rotateClockwise(): void {
    this.transformations.rotationAngle += 90;
    this.applyRotation();
  }

  rotateCounterClockwise(): void {
    this.transformations.rotationAngle -= 90;
    this.applyRotation();
  }

  reset(): void {
    this.transformations.zoomLevel = 1;
    this.transformations.rotationAngle = 0;
    this.resetZoom();
  }

  private resetZoom(): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);
      svgElement
        .transition()
        .call(
          this.zoomBehavior.transform,
          d3.zoomIdentity.scale(this.transformations.zoomLevel)
        );
      this.updateHighlights();
    }
  }

  private applyZoom(factor: number): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);
      this.transformations.zoomLevel *= factor;
      const transform = d3.zoomTransform(svgElement.node() as SVGSVGElement);
      svgElement
        .transition()
        .call(this.zoomBehavior.transform, transform.scale(factor));
    }
  }

  private applyRotation(): void {
    if (this.svgContainer) {
      const svgElement = d3.select(this.svgContainer.nativeElement);
      const transform = d3.zoomTransform(svgElement.node() as SVGSVGElement);
      const combinedTransform = this.getCombinedTransform(transform);
      svgElement.select('g').transition().attr('transform', combinedTransform);
    }
  }

  handleHighlight(highlightIndex: number): void {
    this.currentHighlight = this.highlightList[highlightIndex];
    this.updateHighlights();
  }

  handleImage(imageIndex: number): void {
    this.filePath = this.filePaths[imageIndex];
    this.loadBase64Image();
  }
}
