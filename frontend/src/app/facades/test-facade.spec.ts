import { TestBed } from '@angular/core/testing';

import { TestFacade } from './test-facade';

describe('TestFacade', () => {
  let service: TestFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
