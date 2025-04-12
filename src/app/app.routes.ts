import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';


export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        title: 'dashborad'
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./features/watchlist/watchlist.component').then((m) => m.WatchlistComponent),
    },
    // {
    //     path: 'chart/:ticker',
    //     loadComponent: () => import('./shared/stock-chart/stock-chart.component').then(m => m.StockChartComponent)
    // }
    {
        path: 'chart/:ticker',
        loadComponent: () => import('./features/stock-chart-page/stock-chart-page.component').then((m) => m.StockChartPageComponent)
      }
];
