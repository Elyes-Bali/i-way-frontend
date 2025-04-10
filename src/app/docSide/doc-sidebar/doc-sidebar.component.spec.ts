import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSidebarComponent } from './doc-sidebar.component';

describe('DocSidebarComponent', () => {
  let component: DocSidebarComponent;
  let fixture: ComponentFixture<DocSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
