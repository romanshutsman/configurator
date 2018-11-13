import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTagEditorComponent } from './smart-tag-editor.component';

describe('SmartTagEditorComponent', () => {
  let component: SmartTagEditorComponent;
  let fixture: ComponentFixture<SmartTagEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartTagEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
