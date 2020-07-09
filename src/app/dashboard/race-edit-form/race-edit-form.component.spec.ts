import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceEditFormComponent } from './race-edit-form.component';

describe('RaceEditFormComponent', () => {
  let component: RaceEditFormComponent;
  let fixture: ComponentFixture<RaceEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
