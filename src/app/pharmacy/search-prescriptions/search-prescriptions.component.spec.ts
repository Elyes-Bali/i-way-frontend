import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPrescriptionsComponent } from './search-prescriptions.component';

describe('SearchPrescriptionsComponent', () => {
  let component: SearchPrescriptionsComponent;
  let fixture: ComponentFixture<SearchPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPrescriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
