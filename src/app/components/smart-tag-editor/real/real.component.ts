import { RealStateDintNode } from 'src/app/providers/node.interface';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-real',
  templateUrl: './real.component.html',
  styleUrls: ['./../state/state.component.scss','./real.component.scss']
})
export class RealComponent extends BaseSmartTag implements OnInit {
  @ViewChild('nodeForm') public nodeFrm: NgForm;
  inputInvalidMin = true;
  inputInvalidMax = true;
  cloneSelectedNode: RealStateDintNode = this.service.initNodeValueType;
  node: RealStateDintNode = this.service.initNodeValueType;
  defaultValueType;
  isRequriedValidation1: boolean;
  isRequriedValidation2: boolean;

  @Input() set actionMenu(value) {
    if (value) {
      this.editorComponent = value['component'];
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.isAdding = true;
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns);
        this.defaultValueType = this.ValueTypeReal[0];
        this.cloneSelectedNode.SubType = this.ValueTypeReal.indexOf(this.defaultValueType);
        this.cloneSelectedNode.ParentID = this.node.ID;
      } else if (value.action === this.service.action.edit) {
        this.isAdding = false;
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.defaultValueType = this.ValueTypeReal[this.cloneSelectedNode.SubType];
        this.loadValue();
      }
      this.initData(value);
    }
  }

  constructor(public service: SharedService) {
    super(service);
  }

  ngOnInit() {
    this.onChanges();
  }

  onChanges(): void {
    this.nodeFrm.valueChanges
      .subscribe((value) => {
        this.cloneSelectedNode.valueType = value['ValueTypeDint'];
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.ID = this.nodeiD;
        this.cloneSelectedNode.Type = 1;
        this.sendSmartTagData(this.nodeFrm);
      });
  }
  updateValueType(e) {
    this.cloneSelectedNode.SubType = this.ValueTypeReal.indexOf(e.value);
  }
  getCurrentValue(e) {
    if (e.target.value > 0) {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    }
  }
  onChangeSelect(e) {
    this.onUpdateByChanged(e, this.nodeFrm);
  }
  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    return this.deleteMinus(e, num);
  }
  updateInfoTypesAoi(e, item) {
    this.updateInfoTypes(e, item);
    this.checkAndSend();
  }
  inputNewValue(item, v) {
    this.cloneSelectedNode.lInfoAtt.map(e => {
      if (e.name == item.Name) e.value = v;
    })
    this.checkAndSend();
  }

  checkAndSend() {
    if (this.formAction) {
      this.sendSmartTagData(this.nodeFrm);
    }
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
}
