import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBarComponent } from './message-bar.component';

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


describe('MessageBarComponent', () => {
  let component: MessageBarComponent;
  let fixture: ComponentFixture<MessageBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MessageBarComponent
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
    fixture = TestBed.createComponent(MessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

