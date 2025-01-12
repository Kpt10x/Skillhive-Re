import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqtestComponent } from './mcqtest.component';

describe('McqtestComponent', () => {
  let component: McqtestComponent;
  let fixture: ComponentFixture<McqtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McqtestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McqtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
