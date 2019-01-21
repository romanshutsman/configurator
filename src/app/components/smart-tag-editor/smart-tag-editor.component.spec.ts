import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartTagEditorComponent } from './smart-tag-editor.component';

import { NodeComponent } from './../smart-tag-editor/node/node.component';
import { RealComponent } from './../smart-tag-editor/real/real.component';
import { StateComponent } from './../smart-tag-editor/state/state.component';
import { StringComponent } from './../smart-tag-editor/string/string.component';
import { DintComponent } from './../smart-tag-editor/dint/dint.component';
import { NgForm } from '@angular/forms';

import {
  MatCheckboxModule,
  MatDialogModule,
  MatRadioModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule
} from '@angular/material';
import { ContextMenuModule } from 'ngx-contextmenu';
import { RaUiTreeModule } from '@ra-web-tech-ui-toolkit-navigation';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


describe('SmartTagEditorComponent', () => {
  let component: SmartTagEditorComponent;
  let fixture: ComponentFixture<SmartTagEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SmartTagEditorComponent,
        NodeComponent,
        RealComponent,
        StateComponent,
        StringComponent,
        DintComponent
      ],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        ContextMenuModule.forRoot(),
        RaUiTreeModule,
        HttpClientModule
      ]
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
