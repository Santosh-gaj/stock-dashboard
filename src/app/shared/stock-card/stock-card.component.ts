import { Component, Input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { watchlistSignal } from '../../state/watchlist.signal';
import { Router } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.scss'
})
export class StockCardComponent {

  @Input() ticker!: string;
  @Input() companyName!: string;
  @Input() currentPrice!: number;
  @Input() priceChange!: number;

  private router = inject(Router);
  private watchlistService = inject(WatchlistService);

  get isInWatchlist() {
    return this.watchlistService.watchlist().some(stock => stock.ticker === this.ticker);
  }

  addToWatchlist() {
    this.watchlistService.addToWatchlist({
      ticker: this.ticker,
      companyName: this.companyName,
      currentPrice: this.currentPrice,
      priceChange: this.priceChange,
    });
  }

  removeFromWatchlist() {
    this.watchlistService.removeFromWatchlist(this.ticker);
  }

  goToChart() {
    this.router.navigate(['/chart', this.ticker]);
  }

  get changeClass() {
    return this.priceChange >= 0 ? 'text-green-600' : 'text-red-600';
  }
}


