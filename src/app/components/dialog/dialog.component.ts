import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { SharedService } from './../../providers/shared.service';
import { FormControl, Validators } from '@angular/forms';
import { Programs } from '../../providers/common.interface';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  showInfoList: boolean = false;
  showInfoMessage: boolean = false;
  showVerifyMessage: boolean = false;
  list: any = [];
  controller: string;
  message: any;
  insertForm: Array<Programs>;
  routines = [];
  rung = 0;
  @Input() IsInsert: boolean = false

  name: string = '';
  @Output() postController = new EventEmitter();
  @Output() responseVerify = new EventEmitter();
  @Output() prepareForm = new EventEmitter();
  @Input() set manageOfMessageBox(value: any) {
    if (value) {
      this.list = value.list;
      if (value.list && value.list.length > 0)
        this.showInfoList = true;
      this.message = value.message;
      if (value.message)
        this.showInfoMessage = true;
      this.showVerifyMessage = value.showVerifyMessage;
      if (value.message == 'Can\'t connect to controller!') {
        this.controller = '';
      }
    }
  }
  @Input() set getAllPrograms(value) {
    if (value) {
      this.resetForm();
      this.insertForm = value.programs;
    }
  }
  selectProgram = new FormControl(null, [Validators.required]);
  selectRoutines = new FormControl(null, [Validators.required]);
  enteredName = new FormControl(null, [Validators.required]);
  selectRung = new FormControl(null, [Validators.required]);
  @Input() showInsert = false;
  selectedProgram;
  selectedRoutine;
  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  chooseController(item) {
    this.controller = item.Name;
    this.postController.emit(item);
    this.showInfoList = false;
    this.controller = undefined;
  }

  closeModal1() {
    this.showInfoList = false;
  }

  closeModal2() {
    this.showInfoMessage = false;
  }
  onResponseVerify(e) {
    this.responseVerify.emit({
      verify: e,
      Program: this.selectProgram.value,
      Routine: this.selectRoutines.value,
      Rung: this.selectRung.value,
      Name: this.name
    });
    this.showVerifyMessage = false;
    this.showInsert = false;
  }
  removeMinus(e) {
    const code1 = 'NumpadSubtract';
    const code2 = 'Minus';
    if (e.code === code1 || e.code === code2) {
      return false;
    }
  }
  onSelectedProgram(e) {
    const programRoutines = this.insertForm.filter(i => i.Name == e.value);
    this.routines = programRoutines[0].Routines;
  }
  showInsertForm() {
    this.showInsert = true;
    this.prepareForm.emit();
  }
  resetForm() {
    this.insertForm = [];
    this.name = '';
    this.routines = [];
    this.rung = 0;
    this.selectedProgram = undefined;
    this.selectedRoutine = undefined;
    this.selectProgram.markAsUntouched();
    this.selectRoutines.markAsUntouched();
  }
}
