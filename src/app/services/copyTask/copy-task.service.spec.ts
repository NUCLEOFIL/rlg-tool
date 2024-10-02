import { TestBed } from '@angular/core/testing';

import { CopyTaskService } from './copy-task.service';

describe('CopyTaskService', () => {
  let service: CopyTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
