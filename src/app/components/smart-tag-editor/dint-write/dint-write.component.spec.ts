import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DintWriteComponent } from './dint-write.component';

describe('DintWriteComponent', () => {
  let component: DintWriteComponent;
  let fixture: ComponentFixture<DintWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DintWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DintWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
