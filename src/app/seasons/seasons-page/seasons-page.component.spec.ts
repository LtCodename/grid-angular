import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsPageComponent } from './seasons-page.component';

describe('SeasonsPageComponent', () => {
  let component: SeasonsPageComponent;
  let fixture: ComponentFixture<SeasonsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
