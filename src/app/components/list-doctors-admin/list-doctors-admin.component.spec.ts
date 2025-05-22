import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDoctorsAdminComponent } from './list-doctors-admin.component';

describe('ListDoctorsAdminComponent', () => {
  let component: ListDoctorsAdminComponent;
  let fixture: ComponentFixture<ListDoctorsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDoctorsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDoctorsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
