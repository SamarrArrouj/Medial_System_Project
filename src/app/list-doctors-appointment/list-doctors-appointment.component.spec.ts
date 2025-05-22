import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDoctorsAppointmentComponent } from './list-doctors-appointment.component';

describe('ListDoctorsAppointmentComponent', () => {
  let component: ListDoctorsAppointmentComponent;
  let fixture: ComponentFixture<ListDoctorsAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDoctorsAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDoctorsAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
