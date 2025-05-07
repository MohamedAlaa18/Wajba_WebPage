import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutContentComponent } from './checkout-content.component';

describe('CheckoutContentComponent', () => {
  let component: CheckoutContentComponent;
  let fixture: ComponentFixture<CheckoutContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
