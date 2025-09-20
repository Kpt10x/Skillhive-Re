import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructorTimeTableComponent } from './instructor-timetable.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InstructorService } from '../../services/instructor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('InstructorTimeTableComponent', () => {
  let component: InstructorTimeTableComponent;
  let fixture: ComponentFixture<InstructorTimeTableComponent>;
  let mockInstructorService: jasmine.SpyObj<InstructorService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockInstructorService = jasmine.createSpyObj('InstructorService', ['getInstructor']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [InstructorTimeTableComponent],
      providers: [
        { provide: InstructorService, useValue: mockInstructorService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with assigned courses', () => {
    const mockInstructor = { name: 'John Doe' };
    const mockCourses = [
      { id: '1', name: 'Course 1', instructor: 'John Doe' },
      { id: '2', name: 'Course 2', instructor: 'John Doe' },
    ];

    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockInstructor));
    spyOn(component['http'], 'get').and.returnValue(of(mockCourses));

    component.ngOnInit();
    expect(component.assignedCourses.length).toBe(2);
  });

  it('should navigate to course content when navigateToCourseContent is called', () => {
    component.navigateToCourseContent('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-course-content', '123']);
  });

  it('should allow enrollment when allowEnroll is called', () => {
    spyOn(component['http'], 'patch').and.returnValue(of({}));

    component.loggedInInstructor = { name: 'John Doe' };
    component.allowEnroll('123');

    expect(component['http'].patch).toHaveBeenCalledWith('http://localhost:5000/api/courses/123', { openForEnrollment: true });
  });
});
