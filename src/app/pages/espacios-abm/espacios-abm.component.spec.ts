import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaciosAbmComponent } from './espacios-abm.component';

describe('EspaciosAbmComponent', () => {
  let component: EspaciosAbmComponent;
  let fixture: ComponentFixture<EspaciosAbmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaciosAbmComponent]
    });
    fixture = TestBed.createComponent(EspaciosAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
