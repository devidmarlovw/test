import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestsDetailComponent } from './leave-requests-detail.component';

describe('LeaveRequestsDetailComponent', () => {
  let component: LeaveRequestsDetailComponent;
  let fixture: ComponentFixture<LeaveRequestsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRequestsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
