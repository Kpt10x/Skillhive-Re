import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewByCourseComponent } from './view-by-course.component';

describe('ViewByCourseComponent', () => {
  let component: ViewByCourseComponent;
  let fixture: ComponentFixture<ViewByCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewByCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewByCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
