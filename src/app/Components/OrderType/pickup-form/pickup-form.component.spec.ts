import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupFormComponent } from './pickup-form.component';

describe('PickupFormComponent', () => {
  let component: PickupFormComponent;
  let fixture: ComponentFixture<PickupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
