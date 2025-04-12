import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { StockCardComponent } from '../../shared/stock-card/stock-card.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StockService } from '../../core/services/stock.service';
import { Stock } from '../../interfaces';
import { Subscription, interval, switchMap, catchError, of } from 'rxjs';
import { watchlistSignal } from '../../state/watchlist.signal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, StockCardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stocks: Stock[] = [];
  loading: boolean = true;
  loadingError: boolean = false;
  errorMessage: string = '';
  private sub = new Subscription();

  constructor(
    private stockService: StockService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const cached = this.stockService.getCachedStocks();

    if (cached && cached.length > 0) {
      this.stocks = cached;
      this.loading = false;
    } else {
      this.loading = true;
    }

    const initialSub = this.stockService.getStocks().subscribe({
      next: data => {
        this.stocks = data;
        this.loading = false;

        if (data.length === 0) {
          this.loadingError = true;
          this.errorMessage = '⚠️ Invalid ticker symbols or API limit reached.';
        } else {
          this.loadingError = false;
          this.errorMessage = '';
        }
      },
      error: err => this.setErrorState(err)
    });

    this.sub.add(initialSub);

    const pollingSub = interval(60000).subscribe(() => {
      this.stockService.fetchAndCacheStocks();
    });

    this.sub.add(pollingSub);
  }

  setErrorState(error: any) {
    this.loading = false;
    this.loadingError = true;

    if (error.status === 0) {
      this.errorMessage = '❌ Network error. Please check your internet connection.';
    } else if (error.status >= 500) {
      this.errorMessage = '🚨 Server error. Please try again later.';
    } else {
      this.errorMessage = '⚠️ Failed to load stock data.';
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
