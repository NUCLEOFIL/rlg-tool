import { TestBed } from '@angular/core/testing';

import { PieceDetailsService } from './piece-details.service';

describe('PieceDetailsService', () => {
  let service: PieceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
