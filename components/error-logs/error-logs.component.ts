import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss'],
  standalone: true,
  imports: [TableModule, ButtonModule],
})
export class ErrorLogsComponent {
  @Input() errorLogs: {
    timestamp: string;
    message: string;
    details?: string;
  }[] = [];
  isExpanded = false;

  toggleExpandCollapse(): void {
    this.isExpanded = !this.isExpanded;
  }
}
