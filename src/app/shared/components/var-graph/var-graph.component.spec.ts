import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarGraphComponent } from './var-graph.component';

describe('VarGraphComponent', () => {
  let component: VarGraphComponent;
  let fixture: ComponentFixture<VarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
