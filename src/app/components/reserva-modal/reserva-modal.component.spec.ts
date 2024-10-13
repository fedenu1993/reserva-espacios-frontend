import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaModalComponent } from './reserva-modal.component';

describe('ReservaModalComponent', () => {
  let component: ReservaModalComponent;
  let fixture: ComponentFixture<ReservaModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservaModalComponent]
    });
    fixture = TestBed.createComponent(ReservaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
