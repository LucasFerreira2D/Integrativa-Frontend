import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteDialog } from './parte-dialog';

describe('ParteDialog', () => {
  let component: ParteDialog;
  let fixture: ComponentFixture<ParteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
