import { TestBed } from '@angular/core/testing';

import { CopyRoleService } from './copy-role.service';

describe('CopyRoleService', () => {
  let service: CopyRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
