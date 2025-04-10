import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeChatComponent } from './real-time-chat.component';

describe('RealTimeChatComponent', () => {
  let component: RealTimeChatComponent;
  let fixture: ComponentFixture<RealTimeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealTimeChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
