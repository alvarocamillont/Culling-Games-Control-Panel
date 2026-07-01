import { Service, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Sorcerer, KoganeLog } from '../models';

@Service()
export class CullingGamesService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = '/api/players';

  // Signals for state
  private playersSignal = signal<Sorcerer[]>([]);
  private logsSignal = signal<KoganeLog[]>([]);

  // Exposed read-only signals
  readonly players = this.playersSignal.asReadonly();
  readonly logs = this.logsSignal.asReadonly();

  // Derived statistics using computed signals
  readonly totalPlayers = computed(() => this.playersSignal().length);
  readonly totalPoints = computed(() => this.playersSignal().reduce((sum, p) => sum + p.points, 0));
  readonly mortalityRate = computed(() => {
    const total = this.playersSignal().length;
    if (total === 0) return 0;
    const deceased = this.playersSignal().filter(p => p.status === 'Deceased').length;
    return Math.round((deceased / total) * 100);
  });

  constructor() {
    this.initializeState();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private async initializeState() {
    // Initial logs setup
    const initialLog: KoganeLog = {
      id: 'init-1',
      timestamp: this.getTimeString(),
      text: 'KOGANE MONITORING ENGINE STABLE. Handshake established.',
      type: 'system',
    };
    this.logsSignal.set([initialLog]);

    try {
      // Try to load players from backend
      const playersList = await firstValueFrom(this.http.get<Sorcerer[]>(this.apiUrl));
      this.playersSignal.set(playersList);
      this.addLog(`LOADED: ${playersList.length} active combatant profiles found.`, 'info');
      this.savePlayersToStorage(playersList);
    } catch (err) {
      console.warn('Backend API unavailable, attempting LocalStorage fallback:', err);
      // Fallback to LocalStorage if in browser
      if (this.isBrowser()) {
        const stored = localStorage.getItem('culling_games_sorcerers');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Sorcerer[];
            this.playersSignal.set(parsed);
            this.addLog(`LOADED (Offline): ${parsed.length} active combatant profiles found from LocalStorage.`, 'info');
            return;
          } catch (e) {
            // Ignore error, seed list
          }
        }
      }
      this.addLog('Failed to connect to backend and no local storage backup found.', 'danger');
    }
  }

  async registerPlayer(playerData: Omit<Sorcerer, 'id'>) {
    try {
      const savedPlayer = await firstValueFrom(this.http.post<Sorcerer>(this.apiUrl, playerData));
      this.playersSignal.update(list => [savedPlayer, ...list]);
      this.addLog(`DECLARATION: ${savedPlayer.name} entered ${savedPlayer.colony}. Cursed technique synchronized.`, 'success');
      this.savePlayersToStorage(this.playersSignal());
      return savedPlayer;
    } catch (err) {
      this.addLog(`FAILED REGISTRATION: Could not sync ${playerData.name} with Kenjaku's game board.`, 'danger');
      throw err;
    }
  }

  async adjustPoints(id: string, amount: number) {
    const player = this.playersSignal().find(p => p.id === id);
    if (!player) return;

    const oldPoints = player.points;
    const newPoints = Math.max(0, oldPoints + amount);

    if (oldPoints === newPoints) return;

    try {
      const updatedPlayer = await firstValueFrom(
        this.http.put<Sorcerer>(`${this.apiUrl}/${id}/points`, { points: newPoints })
      );
      this.playersSignal.update(list => list.map(p => p.id === id ? updatedPlayer : p));
      this.addLog(`Rule #10 Adjust: Kogane synchronized ${player.name}'s points (${oldPoints} PTS ➔ ${newPoints} PTS).`, 'transfer');
      this.savePlayersToStorage(this.playersSignal());
    } catch (err) {
      this.addLog(`FAILED ADJUSTMENT: Could not synchronize points for ${player.name}.`, 'danger');
      throw err;
    }
  }

  async toggleLifeStatus(id: string) {
    const player = this.playersSignal().find(p => p.id === id);
    if (!player) return;

    const newStatus = player.status === 'Alive' ? 'Deceased' : 'Alive';

    try {
      const updatedPlayer = await firstValueFrom(
        this.http.put<Sorcerer>(`${this.apiUrl}/${id}/status`, { status: newStatus })
      );
      this.playersSignal.update(list => list.map(p => p.id === id ? updatedPlayer : p));
      
      if (newStatus === 'Deceased') {
        this.addLog(`DEATH NOTIFICATION: Sorcerer ${player.name} eradicated in combat.`, 'danger');
      } else {
        this.addLog(`RESTORATION: Sorcerer ${player.name} reconstructed via Reverse Cursed Technique.`, 'success');
      }
      this.savePlayersToStorage(this.playersSignal());
    } catch (err) {
      this.addLog(`FAILED STATUS CHANGE: Could not update life status for ${player.name}.`, 'danger');
      throw err;
    }
  }

  async deletePlayer(id: string) {
    const player = this.playersSignal().find(p => p.id === id);
    if (!player) return;

    try {
      await firstValueFrom(this.http.delete<Sorcerer>(`${this.apiUrl}/${id}`));
      this.playersSignal.update(list => list.filter(p => p.id !== id));
      this.addLog(`SYSTEM: ${player.name} registry deleted. All Kogane traces vaporized.`, 'danger');
      this.savePlayersToStorage(this.playersSignal());
    } catch (err) {
      this.addLog(`FAILED DELETION: Could not vaporize registry for ${player.name}.`, 'danger');
      throw err;
    }
  }

  async transferPoints(senderId: string, receiverId: string, amount: number) {
    const sender = this.playersSignal().find(p => p.id === senderId);
    const receiver = this.playersSignal().find(p => p.id === receiverId);

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found.');
    }
    if (sender.status !== 'Alive' || receiver.status !== 'Alive') {
      throw new Error('Both participants must be Alive to transfer points.');
    }
    if (sender.points < amount) {
      throw new Error('Insufficient points.');
    }
    if (senderId === receiverId) {
      throw new Error('A participant cannot transfer points to themselves.');
    }

    const newSenderPoints = sender.points - amount;
    const newReceiverPoints = receiver.points + amount;

    try {
      const updatedSender = await firstValueFrom(
        this.http.put<Sorcerer>(`${this.apiUrl}/${senderId}/points`, { points: newSenderPoints })
      );
      const updatedReceiver = await firstValueFrom(
        this.http.put<Sorcerer>(`${this.apiUrl}/${receiverId}/points`, { points: newReceiverPoints })
      );

      this.playersSignal.update(list =>
        list.map(p => {
          if (p.id === senderId) return updatedSender;
          if (p.id === receiverId) return updatedReceiver;
          return p;
        })
      );

      this.addLog(`POINT TRANSFER COMPLETE: ${sender.name} sent ${amount} PTS to ${receiver.name}. Approved by Kogane.`, 'transfer');
      this.savePlayersToStorage(this.playersSignal());
    } catch (err) {
      this.addLog('FAILED POINT TRANSFER: Transaction rejected by Kogane server.', 'danger');
      throw err;
    }
  }

  async resetSystem() {
    try {
      const resetList = await firstValueFrom(this.http.post<Sorcerer[]>('/api/reset', {}));
      this.playersSignal.set(resetList);
      this.clearLogs();
      this.addLog('SYSTEM RESTORED. Initial Culling Game contestant matrix re-loaded.', 'system');
      this.savePlayersToStorage(resetList);
    } catch (err) {
      this.addLog('FAILED SYSTEM RESET: Kenjaku board connection failed.', 'danger');
      throw err;
    }
  }

  addLog(text: string, type: KoganeLog['type'] = 'info') {
    const newLog: KoganeLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      timestamp: this.getTimeString(),
      text,
      type,
    };
    this.logsSignal.update(list => [...list, newLog]);
  }

  clearLogs() {
    this.logsSignal.set([
      {
        id: 'clear-init',
        timestamp: this.getTimeString(),
        text: 'Kogane broadcast memory purged.',
        type: 'system',
      },
    ]);
  }

  private getTimeString(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  private savePlayersToStorage(playersList: Sorcerer[]) {
    if (this.isBrowser()) {
      localStorage.setItem('culling_games_sorcerers', JSON.stringify(playersList));
    }
  }
}
