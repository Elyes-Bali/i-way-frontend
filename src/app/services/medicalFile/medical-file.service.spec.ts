import { TestBed } from '@angular/core/testing';

import { MedicalFileService } from './medical-file.service';

describe('MedicalFileService', () => {
  let service: MedicalFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
