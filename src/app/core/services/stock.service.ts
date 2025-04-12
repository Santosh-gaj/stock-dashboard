import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, BehaviorSubject } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
import { Stock } from '../../interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiKey = environment.stockApiKey;
  private symbols = 'AAPL,MSFT,GOOG,AMZN,TSLA';
  private cachedStocks$ = new BehaviorSubject<Stock[] | null>(null);

  constructor(private http: HttpClient) { }

  getStocks(): Observable<Stock[]> {
    if (this.cachedStocks$.value) {
      return this.cachedStocks$.asObservable().pipe(
        filter((stocks): stocks is Stock[] => stocks !== null)
      );
    } else {
      this.fetchAndCacheStocks();
      return this.cachedStocks$.asObservable().pipe(
        filter((stocks): stocks is Stock[] => stocks !== null)
      );
    }
  }

  public getCachedStocks(): Stock[] | null {
    return this.cachedStocks$.value;
  }

  public fetchAndCacheStocks(): void {
    const url = `https://api.twelvedata.com/quote?symbol=${this.symbols}&apikey=${this.apiKey}`;

    this.http.get<any>(url).pipe(
      map(response => {
        if (response.status === 'error' && response.code === 429) {
          throw new Error('API rate limit reached. Please try again later.');
        }

        const data = Array.isArray(response) ? response : Object.values(response);
        return data.map((stock: any) => ({
          ticker: stock.symbol,
          companyName: stock.name || stock.symbol,
          currentPrice: parseFloat(stock.close),
          priceChange: parseFloat(stock.percent_change)
        }));
      }),
      tap(stocks => this.cachedStocks$.next(stocks)),
      catchError(error => {
        console.error('Full Error Response:', error);
        this.cachedStocks$.next([]); // set empty on error
        return of([]);
      })
    ).subscribe();
  }

  getHistoricalData(ticker: string, range: string): Observable<{ date: string; price: number }[]> {
    const intervalMap: Record<string, string> = {
      '1D': '5min',
      '1W': '30min',
      '1M': '1day',
      '3M': '1day',
      '1Y': '1week',
    };

    const interval = intervalMap[range] || '1day';
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&apikey=${this.apiKey}&outputsize=100`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        if (!response.values) return [];
        return response.values.map((val: any) => ({
          date: val.datetime,
          price: parseFloat(val.close),
        })).reverse(); // reverse to make it chronological
      }),
      catchError((err) => {
        console.error('Failed to fetch historical data:', err);
        return of([]);
      })
    );
  }


}

