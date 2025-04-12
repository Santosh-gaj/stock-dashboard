import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../../core/services/stock.service';
import { StockChartComponent } from '../../shared/stock-chart/stock-chart.component';

@Component({
  selector: 'app-stock-chart-page',
  standalone: true,
  imports: [CommonModule, StockChartComponent],
  templateUrl: './stock-chart-page.component.html',
  styleUrl: './stock-chart-page.component.scss'
})
export class StockChartPageComponent {
  private route = inject(ActivatedRoute);
  private stockService = inject(StockService);

  ticker = '';
  historicalData: { date: string; price: number }[] = [];

  ranges = ['1D', '1W', '1M', '3M', '1Y'];
  selectedRange = '1M';

  showChart = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.ticker = params.get('ticker') || '';
      if (this.ticker) {
        this.loadChartData(this.selectedRange);
      }
    });
  }

  loadChartData(range: string) {
    this.selectedRange = range;
    this.showChart = false;

    this.stockService.getHistoricalData(this.ticker, range).subscribe(data => {
      this.historicalData = [...data];

      setTimeout(() => {
        this.showChart = true;
      }, 0);
    });
  }
}
