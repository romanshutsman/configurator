import { RealStateDintNode } from 'src/app/providers/node.interface';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';


@Component({
  selector: 'app-real',
  templateUrl: './real.component.html',
  styleUrls: ['./real.component.scss']
})
export class RealComponent extends BaseSmartTag implements OnInit {
  @ViewChild('nodeForm') public nodeFrm: NgForm;
  inputInvalidMin = true;
  inputInvalidMax = true;
  cloneSelectedNode: RealStateDintNode = this.service.initNodeValueType;
  node: RealStateDintNode = this.service.initNodeValueType;
  defaultValueType;

  @Input() set actionMenu(value) {
    if (value) {
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns2);
        this.defaultValueType = this.ValueTypeReal[0];
        this.cloneSelectedNode.iSubType = this.ValueTypeReal.indexOf(this.defaultValueType);
        this.initAoi(value);
      } else if (value.action === this.service.action.edit) {
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.defaultValueType = this.ValueTypeReal[this.cloneSelectedNode.iSubType];
        this.loadValue();
        this.initAoi(value);
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
        console.log(value);
        this.cloneSelectedNode.valueType = value['ValueTypeDint'];
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.iD = this.nodeiD;
        this.cloneSelectedNode.iType = 1;
        console.log(this.cloneSelectedNode);
        this.sendSmartTagData(this.nodeFrm);
      });
  }
  updateValueType(e) {
    this.cloneSelectedNode.iSubType = this.ValueTypeReal.indexOf(e.value);
  }
  testPattern(e, check) {
    const test = /^(([1-9]{1}[\d]{1}|[1-9]{1})|0|((\d|\d\d)\.\d{1,2})|100(\.[0]{1,2})?)$/.test(e.target.value);
    check === 1 ? this.inputInvalidMin = test : this.inputInvalidMax = test;
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

}
