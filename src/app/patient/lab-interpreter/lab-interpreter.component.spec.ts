import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabInterpreterComponent } from './lab-interpreter.component';

describe('LabInterpreterComponent', () => {
  let component: LabInterpreterComponent;
  let fixture: ComponentFixture<LabInterpreterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabInterpreterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabInterpreterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
