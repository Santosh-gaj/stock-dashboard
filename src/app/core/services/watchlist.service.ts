import { Injectable, signal } from '@angular/core';
import { Stock } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {

  private readonly STORAGE_KEY = 'watchlist';

  private _watchlist = signal<Stock[]>([]); 

  watchlist = this._watchlist.asReadonly(); 

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadWatchlist();
    }
  }

  private loadWatchlist() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this._watchlist.set(JSON.parse(saved)); 
    }
  }

  private saveWatchlist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._watchlist())); 
    }
  }

  addToWatchlist(stock: Stock) {
    const exists = this._watchlist().some((s) => s.ticker === stock.ticker);
    if (!exists) {
      this._watchlist.update((list) => [...list, stock]); 
      this.saveWatchlist(); 
    }
  }


  removeFromWatchlist(ticker: string) {
    this._watchlist.update((list) => list.filter((s) => s.ticker !== ticker)); 
    this.saveWatchlist(); 
  }
}
