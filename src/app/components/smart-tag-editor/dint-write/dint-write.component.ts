import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from '../base-smart-tag';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-dint-write',
  templateUrl: './dint-write.component.html',
  styleUrls: ['./dint-write.component.scss']
})
export class DintWriteComponent extends BaseSmartTag implements OnInit {

  isRequriedValidation1: boolean;
  isRequriedValidation2: boolean;
  @ViewChild('nodeForm') public nodeFrm: NgForm;

  @Input() set actionMenu(value) {
    if (value) {
      this.formAction = value;
      if (value.action === this.service.action.add) {
        this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns2);
        this.initAoi(value);
        this.initAttributes();
        this.initCheckbox();
        this.cloneSelectedNode.ParentID = this.node.ID;
      } else if (value.action === this.service.action.edit) {
        this.cloneSelectedNode = this.node;
        this.defaultValueOnEdit(this.nodeFrm);
        this.loadValue();
        this.initAoi(value);
        this.initAttributes();
        this.initCheckbox();
      }
      this.filterValueLabel();
    }
  }


  constructor(public service: SharedService) {
      super(service)
   }

  ngOnInit() {
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
  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[1];
    return this.deleteMinus(e, num);
  }
}
