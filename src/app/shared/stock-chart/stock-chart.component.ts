import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss'],
})
export class StockChartComponent implements OnChanges {
  @Input() ticker: string = '';
  @Input() historicalData: { date: string; price: number }[] = [];
  @Input() loading: boolean = false;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Stock Price',
        fill: true,
        tension: 0.3,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historicalData'] && this.historicalData?.length) {
      this.lineChartData.labels = this.historicalData.map(item => item.date);
      this.lineChartData.datasets[0].data = this.historicalData.map(item => item.price);
    }
  }
}
