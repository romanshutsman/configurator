import { NodeTree } from './../../../providers/node.interface';
import { SharedService } from './../../../providers/shared.service';
import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-string',
  templateUrl: './string.component.html',
  styleUrls: ['./../state/state.component.scss','./string.component.scss']
})
export class StringComponent extends BaseSmartTag implements OnInit {

  @ViewChild('nodeForm') public nodeFrm: NgForm;
  cloneSelectedNode: NodeTree = this.service.initNode;
  node: NodeTree = this.service.initNode;
  @Input() set cloneSelected(value) {
    if (value) {
      this.cloneSelectedNode = value;
      this.nodeiD = this.cloneSelectedNode.ID;
    } else {
      this.cloneSelectedNode.TagName = '';

    }
  }

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
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.ID = this.nodeiD;
        this.cloneSelectedNode.Type = 3;
        this.sendSmartTagData(this.nodeFrm);
      });
  }

  removeMinus(e, num) {
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
