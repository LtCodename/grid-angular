import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudPanelComponent } from './cloud-panel.component';

describe('CloudPanelComponent', () => {
  let component: CloudPanelComponent;
  let fixture: ComponentFixture<CloudPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
