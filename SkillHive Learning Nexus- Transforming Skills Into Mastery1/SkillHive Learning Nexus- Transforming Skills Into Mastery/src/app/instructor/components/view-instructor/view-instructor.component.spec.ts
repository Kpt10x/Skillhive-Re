import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstructorComponent } from './view-instructor.component';

describe('ViewInstructorComponent', () => {
  let component: ViewInstructorComponent;
  let fixture: ComponentFixture<ViewInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInstructorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
