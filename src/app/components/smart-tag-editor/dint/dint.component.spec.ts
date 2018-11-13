import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DintComponent } from './dint.component';

describe('DintComponent', () => {
  let component: DintComponent;
  let fixture: ComponentFixture<DintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
