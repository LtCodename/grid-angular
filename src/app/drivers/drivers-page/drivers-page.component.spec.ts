import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversPageComponent } from './drivers-page.component';

describe('DriversPageComponent', () => {
  let component: DriversPageComponent;
  let fixture: ComponentFixture<DriversPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
