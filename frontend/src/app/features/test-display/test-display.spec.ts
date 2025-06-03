import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDisplayComponent } from './test-display.component';

describe('TestDisplay', () => {
  let component: TestDisplayComponent;
  let fixture: ComponentFixture<TestDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
