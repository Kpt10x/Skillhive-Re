import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminveiwComponent } from './adminveiw.component';

describe('AdminveiwComponent', () => {
  let component: AdminveiwComponent;
  let fixture: ComponentFixture<AdminveiwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminveiwComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminveiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
