import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Publicacionmaterialcomponent } from './publicacionmaterialcomponent';

describe('Publicacionmaterialcomponent', () => {
  let component: Publicacionmaterialcomponent;
  let fixture: ComponentFixture<Publicacionmaterialcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Publicacionmaterialcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Publicacionmaterialcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
