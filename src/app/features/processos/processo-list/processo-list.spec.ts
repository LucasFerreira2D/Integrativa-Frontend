import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoList } from './processo-list';

describe('ProcessoList', () => {
  let component: ProcessoList;
  let fixture: ComponentFixture<ProcessoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
