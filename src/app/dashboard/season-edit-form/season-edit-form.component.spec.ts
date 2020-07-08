import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonEditFormComponent } from './season-edit-form.component';

describe('SeasonEditFormComponent', () => {
  let component: SeasonEditFormComponent;
  let fixture: ComponentFixture<SeasonEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
