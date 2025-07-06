import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCodesComponent } from './test-codes.component';

describe('TestCodesComponent', () => {
  let component: TestCodesComponent;
  let fixture: ComponentFixture<TestCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
