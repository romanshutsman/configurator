import { RealStateDintNode } from './../../../providers/node.interface';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-dint',
  templateUrl: './dint.component.html',
  styleUrls: ['./dint.component.scss']
})
export class DintComponent extends BaseSmartTag implements OnInit {

  @ViewChild('nodeForm') public nodeFrm: NgForm;
  tagnameDisable = false;
  programNameDisabled = false;
  routineDisabled = false;
  cloneSelectedNode: RealStateDintNode = this.service.initNodeValueType;
  node: RealStateDintNode = this.service.initNodeValueType;
  defaultValueType;

  @Input() set actionMenu(value) {
    if (value) {
      console.log('AGHGGUH',value)
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns2);
        this.defaultValueType = this.ValueTypeStateDint[0];
        this.cloneSelectedNode.iSubType = this.ValueTypeStateDint.indexOf(this.defaultValueType);
        this.initAoi(value);
        this.initAttributes();
      } else if (value.action === this.service.action.edit) {
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.defaultValueType = this.ValueTypeStateDint[this.cloneSelectedNode.iSubType];
        this.loadValue();
        this.initAoi(value);
        this.initAttributes();
      }
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
        this.cloneSelectedNode.iD = this.nodeiD;
        this.cloneSelectedNode.iType = 2;
        this.sendSmartTagData(this.nodeFrm);
      });
  }
  updateValueType(e) {
    this.cloneSelectedNode.iSubType = this.ValueTypeStateDint.indexOf(e.value);
  }
  getCurrentValue(e) {
    if (e.target.value > 0) {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[2];
    }
  }
  onChangeSelect(e) {
    this.onCheckRadio(e, this.nodeFrm);
  }
  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[2];
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
}