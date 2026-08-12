import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndamentoDialog } from './andamento-dialog';

describe('AndamentoDialog', () => {
  let component: AndamentoDialog;
  let fixture: ComponentFixture<AndamentoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndamentoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndamentoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
