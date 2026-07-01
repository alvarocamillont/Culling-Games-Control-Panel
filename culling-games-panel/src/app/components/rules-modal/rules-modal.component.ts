import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-rules-modal',
  standalone: true,
  imports: [],
  templateUrl: './rules-modal.component.html',
  styleUrls: ['./rules-modal.component.css']
})
export class RulesModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly closed = output<void>();

  onClose() {
    this.closed.emit();
  }
}
