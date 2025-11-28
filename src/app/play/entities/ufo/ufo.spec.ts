import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ufo } from './ufo';

describe('Ufo', () => {
  let component: Ufo;
  let fixture: ComponentFixture<Ufo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ufo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ufo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
