import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveThruFormComponent } from './drive-thru-form.component';

describe('DriveThruFormComponent', () => {
  let component: DriveThruFormComponent;
  let fixture: ComponentFixture<DriveThruFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveThruFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriveThruFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
