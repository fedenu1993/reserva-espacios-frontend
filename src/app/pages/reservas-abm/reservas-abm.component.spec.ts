import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasAbmComponent } from './reservas-abm.component';

describe('ReservasAbmComponent', () => {
  let component: ReservasAbmComponent;
  let fixture: ComponentFixture<ReservasAbmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservasAbmComponent]
    });
    fixture = TestBed.createComponent(ReservasAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
