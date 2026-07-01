import { Component, input, output, effect, ElementRef, viewChild } from '@angular/core';
import { KoganeLog } from '../../models';

@Component({
  selector: 'app-kogane-logs',
  standalone: true,
  imports: [],
  templateUrl: './kogane-logs.component.html',
  styleUrls: ['./kogane-logs.component.css']
})
export class KoganeLogsComponent {
  readonly logs = input.required<KoganeLog[]>();
  readonly cleared = output<void>();

  private readonly logsContainer = viewChild<ElementRef<HTMLDivElement>>('logsContainer');

  constructor() {
    effect(() => {
      this.logs();
      const container = this.logsContainer();
      if (container) {
        setTimeout(() => {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        }, 0);
      }
    });
  }

  onClear() {
    this.cleared.emit();
  }
}
