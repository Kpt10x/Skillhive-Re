import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCourseInstructorComponent } from './managecourse.component';

describe('ManageCourseInstructorComponent', () => {
  let component: ManageCourseInstructorComponent;
  let fixture: ComponentFixture<ManageCourseInstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCourseInstructorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCourseInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
