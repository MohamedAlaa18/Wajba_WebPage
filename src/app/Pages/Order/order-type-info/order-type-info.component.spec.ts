import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypeInfoComponent } from './order-type-info.component';

describe('OrderTypeInfoComponent', () => {
  let component: OrderTypeInfoComponent;
  let fixture: ComponentFixture<OrderTypeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTypeInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
