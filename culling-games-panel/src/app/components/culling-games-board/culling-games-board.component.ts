import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { form, FormField, submit, min, required, validate } from '@angular/forms/signals';
import { CullingGamesService } from '../../services/culling-games.service';
import { PlayerRegistrationComponent } from '../player-registration/player-registration.component';
import { PlayerGridComponent } from '../player-grid/player-grid.component';
import { KoganeLogsComponent } from '../kogane-logs/kogane-logs.component';
import { RulesModalComponent } from '../rules-modal/rules-modal.component';
import { Sorcerer } from '../../models';

@Component({
  selector: 'app-culling-games-board',
  standalone: true,
  imports: [
    FormField,
    PlayerRegistrationComponent,
    PlayerGridComponent,
    KoganeLogsComponent,
    RulesModalComponent
  ],
  templateUrl: './culling-games-board.component.html',
  styleUrls: ['./culling-games-board.component.css']
})
export class CullingGamesBoardComponent implements OnInit {
  protected readonly cullingGamesService = inject(CullingGamesService);

  // Clock
  protected readonly systemClock = signal('');

  // UI state
  protected readonly activeLeftTab = signal<'register' | 'transfer'>('register');
  protected readonly isRulesModalOpen = signal(false);

  // Filters
  protected readonly searchTerm = signal('');
  protected readonly colonyFilter = signal('ALL');
  protected readonly statusFilter = signal('ALL');

  // Computed signals
  protected readonly alivePlayers = computed(() => 
    this.cullingGamesService.players().filter(p => p.status === 'Alive')
  );

  protected readonly filteredPlayers = computed(() => {
    const list = this.cullingGamesService.players();
    const search = this.searchTerm().toLowerCase().trim();
    const colony = this.colonyFilter();
    const status = this.statusFilter();

    return list.filter(p => {
      const matchesSearch = !search || 
        p.name.toLowerCase().includes(search) || 
        (p.technique && p.technique.toLowerCase().includes(search));
      const matchesColony = colony === 'ALL' || p.colony === colony;
      const matchesStatus = status === 'ALL' || p.status === status;
      return matchesSearch && matchesColony && matchesStatus;
    });
  });

  // Signal Form for Point Transfer
  protected readonly transferModel = signal({
    senderId: '',
    receiverId: '',
    amount: 1
  });

  protected readonly transferForm = form(this.transferModel, (s) => {
    required(s.senderId, { message: 'Sender is required.' });
    required(s.receiverId, { message: 'Receiver is required.' });
    min(s.amount, 1, { message: 'Transfer points must be at least 1.' });

    // Custom validation: Sender and Receiver cannot be same
    validate(s.receiverId, ({ value, valueOf }) => {
      if (value() && value() === valueOf(s.senderId)) {
        return { kind: 'selfTransfer', message: 'A participant cannot transfer points to themselves.' };
      }
      return undefined;
    });

    // Custom validation: Sender must have enough points
    validate(s.amount, ({ value, valueOf }) => {
      const senderId = valueOf(s.senderId);
      const senderPlayer = this.cullingGamesService.players().find(p => p.id === senderId);
      if (senderPlayer && senderPlayer.points < value()) {
        return { kind: 'insufficientPoints', message: `Insufficient points. Sender only has ${senderPlayer.points} PTS.` };
      }
      return undefined;
    });
  });

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  private updateClock() {
    const now = new Date();
    const formatStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    this.systemClock.set(formatStr);
  }

  // Handlers
  onRegisterPlayer(playerData: Omit<Sorcerer, 'id'>) {
    this.cullingGamesService.registerPlayer(playerData);
  }

  onAdjustPoints(event: { id: string; amount: number }) {
    this.cullingGamesService.adjustPoints(event.id, event.amount);
  }

  onToggleStatus(id: string) {
    this.cullingGamesService.toggleLifeStatus(id);
  }

  onDeletePlayer(id: string) {
    const player = this.cullingGamesService.players().find(p => p.id === id);
    if (!player) return;
    if (confirm(`Eradicate all Kogane telemetry data for "${player.name}"? This cannot be undone.`)) {
      this.cullingGamesService.deletePlayer(id);
    }
  }

  onTransferPoints() {
    submit(this.transferForm, async () => {
      const { senderId, receiverId, amount } = this.transferModel();
      try {
        await this.cullingGamesService.transferPoints(senderId, receiverId, amount);
        this.transferModel.set({
          senderId: '',
          receiverId: '',
          amount: 1
        });
        this.transferForm().reset();
        alert('Rule #10 Enforced!\nPoints successfully transferred.');
      } catch (err: any) {
        alert(err.message || 'Transfer failed.');
      }
    });
  }

  onResetSystem() {
    if (confirm('Restore the monitoring panel to initial game registry state? All custom-registered sorcerers and point modifications will be purged.')) {
      this.cullingGamesService.resetSystem();
      this.searchTerm.set('');
      this.colonyFilter.set('ALL');
      this.statusFilter.set('ALL');
    }
  }
}
