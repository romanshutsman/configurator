import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { SharedService } from './providers/shared.service';
import { ContextMenuModule } from 'ngx-contextmenu';
//WBTUI
import { RaUiStaticTextModule } from '@ra-web-tech-ui-toolkit/common-utils';
import { RaUiTreeModule } from '@ra-web-tech-ui-toolkit/navigation';
import { RaUiInputModule } from '@ra-web-tech-ui-toolkit/form-system';
import { RaUiFormModule } from '@ra-web-tech-ui-toolkit/form-system';
import { RaUiButtonModule } from '@ra-web-tech-ui-toolkit/common-utils';

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MenuComponent } from './components/menu/menu.component';
import { InfoBarComponent } from './components//info-bar/info-bar.component';
import { MessageBarComponent } from './components//message-bar/message-bar.component';
import { ControlBarComponent } from './components//control-bar/control-bar.component';
import { ModelTreeComponent } from './components//model-tree/model-tree.component';
import { SmartTagEditorComponent} from './components/smart-tag-editor/smart-tag-editor.component';
import { NodeComponent } from './components/smart-tag-editor/node/node.component';
import { RealComponent } from './components/smart-tag-editor/real/real.component';
import { StateComponent } from './components/smart-tag-editor/state/state.component';
import { DintComponent } from './components/smart-tag-editor/dint/dint.component';
import { StringComponent } from './components/smart-tag-editor/string/string.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogComponent,
    MenuComponent,
    InfoBarComponent,
    MessageBarComponent,
    ControlBarComponent,
    ModelTreeComponent,
    SmartTagEditorComponent,
    NodeComponent,
    RealComponent,
    StateComponent,
    DintComponent,
    StringComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDialogModule,
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
    RaUiStaticTextModule,
    RaUiTreeModule,
    RaUiInputModule,
    RaUiFormModule,
    RaUiButtonModule,
    RaUiStaticTextModule,
    ContextMenuModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
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
  ],

  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
