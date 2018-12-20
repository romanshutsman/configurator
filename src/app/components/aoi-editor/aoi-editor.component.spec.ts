import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoiEditorComponent } from './aoi-editor.component';

describe('AoiEditorComponent', () => {
  let component: AoiEditorComponent;
  let fixture: ComponentFixture<AoiEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoiEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
