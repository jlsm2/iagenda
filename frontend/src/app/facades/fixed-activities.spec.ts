import { TestBed } from '@angular/core/testing';

import { FixedActivities } from './fixed-activities';

describe('FixedActivities', () => {
  let service: FixedActivities;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedActivities);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
