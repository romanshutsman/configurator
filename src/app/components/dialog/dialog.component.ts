import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { SharedService } from './../../providers/shared.service';
import { FormControl, Validators } from '@angular/forms';
import { Programs } from '../../providers/common.interface';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  show: boolean = false;
  showConnect: boolean = false;
  showVerify: boolean = false;
  list: any = [];
  controller: string;
  message: any;
  insertForm: Programs[];
  routines =  [];
  rung = 0;
  @Output() postController = new EventEmitter();
  @Output() responseVerify = new EventEmitter();
  @Input() set manageOfMessageBox(value: any) {
    if (value) {
      this.list = value.list;
      this.show = value.show;
      this.message = value.message;
      this.showConnect = value.showConnect;
      this.showVerify = value.showVerify;
      if (value.message == 'Can\'t connect to controller!') {
        this.controller = '';
      }
    }
  }
  @Input() set getAllPrograms(value) {
    if(value) {
      this.resetForm();
      this.insertForm = value.programs;
    }
  }
  selectProgram = new FormControl(null, [Validators.required]);
  selectRoutines = new FormControl(null, [Validators.required]);
  selectRung = new FormControl(null, [Validators.required, Validators.pattern('^\d*[0-9]\d*$')]);
  showInsert = false;
  selectedProgram;
  selectedRoutine;
  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  chooseController(item) {
    this.controller = item.Version;
    this.cdRef.detectChanges();
    this.postController.emit(item);
    setTimeout(() => {
      this.show = false;
      this.cdRef.detectChanges();
    }, 3000);
  }

  closeModal1() {
    this.show = false;
    this.cdRef.detectChanges();
  }

  closeModal2() {
    this.showConnect = false;
    this.cdRef.detectChanges();
  }
  onResponseVerify(e) {
    this.responseVerify.emit({
      verify: e,
      Program: this.selectProgram.value,
      Routine: this.selectRoutines.value,
      Rung: this.selectRung.value,
    });
    this.showVerify = false;
    this.showInsert = false; 
    this.cdRef.detectChanges();
  }
  removeMinus(e) {
    const code1 = 'NumpadSubtract';
    const code2 = 'Minus';
    if (e.code === code1 || e.code === code2) {
      return false;
    }
  }
  onSelectedProgram(e) {
    const programRoutines = this.insertForm.filter(i=>i.Name==e.value);
    this.routines = programRoutines[0].Routines;
  }
  showInsertForm() {
    this.showInsert = true;
  }
  resetForm() {
    this.insertForm = [];
    this.routines = [];
    this.rung = 0;
    this.selectedProgram = undefined;
    this.selectedRoutine = undefined;
    this.selectProgram.markAsUntouched();
    this.selectRoutines.markAsUntouched();
    this.cdRef.detectChanges();
  }
}
