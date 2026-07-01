import { Component, input, output } from '@angular/core';
import { Sorcerer } from '../../models';

@Component({
  selector: 'app-player-grid',
  standalone: true,
  imports: [],
  templateUrl: './player-grid.component.html',
  styleUrls: ['./player-grid.component.css']
})
export class PlayerGridComponent {
  readonly players = input.required<Sorcerer[]>();

  readonly pointsAdjusted = output<{ id: string; amount: number }>();
  readonly statusToggled = output<string>();
  readonly playerDeleted = output<string>();

  onAdjustPoints(id: string, amount: number) {
    this.pointsAdjusted.emit({ id, amount });
  }

  onToggleStatus(id: string) {
    this.statusToggled.emit(id);
  }

  onDeletePlayer(id: string) {
    this.playerDeleted.emit(id);
  }
}
