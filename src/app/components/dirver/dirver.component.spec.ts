import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirverComponent } from './dirver.component';

describe('DirverComponent', () => {
  let component: DirverComponent;
  let fixture: ComponentFixture<DirverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
