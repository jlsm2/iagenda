import { TestBed } from '@angular/core/testing';

import { FlexibleActivities } from './flexible-activities';

describe('FlexibleActivities', () => {
  let service: FlexibleActivities;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlexibleActivities);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
