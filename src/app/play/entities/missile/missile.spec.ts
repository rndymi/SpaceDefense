import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Missile } from './missile';

describe('Missile', () => {
  let component: Missile;
  let fixture: ComponentFixture<Missile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Missile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Missile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
