import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { InfoBarComponent } from './../info-bar/info-bar.component';
import { MessageBarComponent } from './../message-bar/message-bar.component';
import { MenuComponent } from './../menu/menu.component';
import { ModelTreeComponent } from './../model-tree/model-tree.component';
import { SmartTagEditorComponent } from './../smart-tag-editor/smart-tag-editor.component';
import { ControlBarComponent } from './../control-bar/control-bar.component';
import { DialogComponent } from './../dialog/dialog.component';
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
import { RaUiTreeModule } from '@ra-web-tech-ui-toolkit/navigation';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        InfoBarComponent,
        MessageBarComponent,
        MenuComponent,
        ModelTreeComponent,
        SmartTagEditorComponent,
        ControlBarComponent,
        DialogComponent,
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
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
