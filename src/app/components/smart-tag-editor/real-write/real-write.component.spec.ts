import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealWriteComponent } from './real-write.component';

describe('RealWriteComponent', () => {
  let component: RealWriteComponent;
  let fixture: ComponentFixture<RealWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
