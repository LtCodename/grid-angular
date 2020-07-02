import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverEditFormComponent } from './driver-edit-form.component';

describe('DriverEditFormComponent', () => {
  let component: DriverEditFormComponent;
  let fixture: ComponentFixture<DriverEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
