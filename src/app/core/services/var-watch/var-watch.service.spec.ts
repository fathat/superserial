import { TestBed } from '@angular/core/testing';

import { VarWatchService } from './var-watch.service';

describe('VarWatchService', () => {
  let service: VarWatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarWatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
