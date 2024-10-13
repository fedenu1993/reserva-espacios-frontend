import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioModalComponent } from './espacio-modal.component';

describe('EspacioModalComponent', () => {
  let component: EspacioModalComponent;
  let fixture: ComponentFixture<EspacioModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspacioModalComponent]
    });
    fixture = TestBed.createComponent(EspacioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
