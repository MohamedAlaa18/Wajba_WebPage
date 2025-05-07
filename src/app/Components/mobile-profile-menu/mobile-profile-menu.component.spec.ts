import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProfileMenuComponent } from './mobile-profile-menu.component';

describe('MobileProfileMenuComponent', () => {
  let component: MobileProfileMenuComponent;
  let fixture: ComponentFixture<MobileProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileProfileMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
