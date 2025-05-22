import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieSymptomesComponent } from './saisie-symptomes.component';

describe('SaisieSymptomesComponent', () => {
  let component: SaisieSymptomesComponent;
  let fixture: ComponentFixture<SaisieSymptomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaisieSymptomesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieSymptomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
