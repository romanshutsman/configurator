import { RealStateDintNode } from './../../../providers/node.interface';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-dint',
  templateUrl: './dint.component.html',
  styleUrls: ['./../state/state.component.scss','./dint.component.scss']
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
      this.editorComponent = value['component'];
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.isAdding = true;
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns);
        this.defaultValueType = this.ValueTypeStateDint[0];
        this.cloneSelectedNode.SubType = this.ValueTypeStateDint.indexOf(this.defaultValueType);
        this.cloneSelectedNode.ParentID = this.node.ID;
      } else if (value.action === this.service.action.edit) {
        this.isAdding = false;
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.defaultValueType = this.ValueTypeStateDint[this.cloneSelectedNode.SubType];
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
        this.cloneSelectedNode.Type = 2;
        this.sendSmartTagData(this.nodeFrm);
      });
  }
  updateValueType(e) {
    this.cloneSelectedNode.SubType = this.ValueTypeStateDint.indexOf(e.value);
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
  onChangeCreation(e) {
    this.changeCreation(this.nodeFrm);
  }
}