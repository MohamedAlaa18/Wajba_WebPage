import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypeModalComponent } from './order-type-modal.component';

describe('OrderTypeModalComponent', () => {
  let component: OrderTypeModalComponent;
  let fixture: ComponentFixture<OrderTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTypeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
