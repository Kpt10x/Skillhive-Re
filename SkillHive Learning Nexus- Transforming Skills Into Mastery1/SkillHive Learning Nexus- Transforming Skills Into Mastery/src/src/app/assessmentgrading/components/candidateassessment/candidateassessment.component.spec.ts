import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateassessmentComponent } from './candidateassessment.component';

describe('CandidateassessmentComponent', () => {
  let component: CandidateassessmentComponent;
  let fixture: ComponentFixture<CandidateassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateassessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
