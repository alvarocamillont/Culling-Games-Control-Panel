import { Component } from '@angular/core';
import { CullingGamesBoardComponent } from './components/culling-games-board/culling-games-board.component';

@Component({
  selector: 'app-root',
  imports: [CullingGamesBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {}
