import { TestBed } from '@angular/core/testing';

import { SerialPortService as SerialPortService } from './serial-port.service';

describe('SerialPortServiceService', () => {
  let service: SerialPortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialPortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
