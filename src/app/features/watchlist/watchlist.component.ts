import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StockCardComponent } from '../../shared/stock-card/stock-card.component';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink, StockCardComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss',
  // signals: true
})
export class WatchlistComponent {
  private watchlistService = inject(WatchlistService);

  watchlist = this.watchlistService.watchlist;

  remove(ticker: string) {
    this.watchlistService.removeFromWatchlist(ticker);
  }
}
