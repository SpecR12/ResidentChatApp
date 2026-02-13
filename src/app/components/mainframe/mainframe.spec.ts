import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mainframe } from './mainframe';

describe('Mainframe', () => {
  let component: Mainframe;
  let fixture: ComponentFixture<Mainframe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mainframe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mainframe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
