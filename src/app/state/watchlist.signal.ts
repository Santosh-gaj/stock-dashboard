import { signal } from '@angular/core';
import { Stock } from '../interfaces';

export const watchlistSignal = signal<Stock[]>([]);