import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReclamationsComponent } from './edit-reclamations.component';

describe('EditReclamationsComponent', () => {
  let component: EditReclamationsComponent;
  let fixture: ComponentFixture<EditReclamationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReclamationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
