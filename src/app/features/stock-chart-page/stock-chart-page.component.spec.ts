import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockChartPageComponent } from './stock-chart-page.component';

describe('StockChartPageComponent', () => {
  let component: StockChartPageComponent;
  let fixture: ComponentFixture<StockChartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockChartPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockChartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
