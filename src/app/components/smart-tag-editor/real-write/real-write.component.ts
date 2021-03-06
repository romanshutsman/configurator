import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from '../base-smart-tag';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-real-write',
  templateUrl: './real-write.component.html',
  styleUrls: ['./../state/state.component.scss', './real-write.component.scss']
})
export class RealWriteComponent extends BaseSmartTag implements OnInit {
  isRequriedValidation1: boolean;
  isRequriedValidation2: boolean;
  @ViewChild('nodeForm') public nodeFrm: NgForm;
  @Input() set actionMenu(value) {
    if (value) {
      this.editorComponent = value['component'];
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.isAdding = true;
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns);
        this.cloneSelectedNode.ParentID = this.node.ID;
      } else if (value.action === this.service.action.edit) {
        this.isAdding = false;
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.setUpdateBy();
      }
      this.initData(value);
    }
  }
  constructor(public service: SharedService) {
    super(service)
 }

  ngOnInit() {
    this.onChanges();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  onChanges(): void {
    this.subscription = this.nodeFrm.valueChanges
      .subscribe((value) => {
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.ID = this.nodeiD;
        this.cloneSelectedNode.Type = 4;
        this.sendSmartTagData(this.nodeFrm);
      });
  }
  updateInfoTypesAoi(e, item) {
    this.updateInfoTypes(e, item);
    this.checkAndSend();
  }
  checkAndSend() {
    if (this.formAction) {
      this.sendSmartTagData(this.nodeFrm);
    }
  }
  inputNewValue(item, v) {
    this.cloneSelectedNode.lInfoAtt.map(e => {
      if (e.name == item.Name) e.value = v;
    })
    this.checkAndSend();
  }
  updateValidity() {
    this.nodeFrm.controls.minval.updateValueAndValidity();
    this.nodeFrm.controls.maxval.updateValueAndValidity();
    if(this.nodeFrm.controls.minval.errors) {
      if(!this.nodeFrm.controls.minval.errors.pattern) {
        this.isRequriedValidation1 = false;
      }
    }
    if(this.nodeFrm.controls.maxval.errors) {
      if(!this.nodeFrm.controls.maxval.errors.pattern) {
        this.isRequriedValidation2 = false;
      }
    }
  }
  checkRequiredValidation(control) {
    if(this.nodeFrm.controls[control]) {
      if(this.nodeFrm.controls[control].errors) {
        if(this.nodeFrm.controls[control].errors.required && this.nodeFrm.controls[control].touched) {
          this.isRequriedValidation1 = true;
          this.isRequriedValidation2 = true;
          return true;
        }
      }
    }
  }
  checkMinMaxValidation(control) {
    if(this.nodeFrm.controls[control]) {
      if(this.nodeFrm.controls[control].errors) {
        if(this.nodeFrm.controls[control].errors.errMinMax && this.nodeFrm.controls[control].touched) {
          if(control == 'minval') {
            if(this.isRequriedValidation1) return false;
          }
          if(control == 'maxval') {
            if(this.isRequriedValidation2) return false;
          }
          return true;
        }  
      }
    }
  }
  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    return this.deleteMinus(e, num);
  }
}
