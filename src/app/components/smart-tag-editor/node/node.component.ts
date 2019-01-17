import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NodeTree } from 'src/app/providers/node.interface';
import { NgForm, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent extends BaseSmartTag implements OnInit {

  typesOfCheckboxes = [];
  @ViewChild('nodeForm') public nodeFrm: NgForm;


  @Input() set cloneSelected(value) {
    if (value) {
      this.cloneSelectedNode = value;
      this.nodeiD = this.cloneSelectedNode.iD;
    }
  }

  @Input() set actionMenu(value) {
    if (value) {
      console.log(value);
      this.formAction = value;
      if (value.type == 'node') {
        if (value.action === this.service.action.add) {
          this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns);
          if (this.nodeFrm.controls['tagname'] && this.nodeFrm.controls['label'] && this.nodeFrm.controls['sProgram']) {
            this.nodeFrm.controls['tagname'].reset();
            this.nodeFrm.controls['label'].reset();
            this.nodeFrm.controls['sProgram'].reset();
          }
          this.initAoi(value);
          this.initAttributes();
          this.initCheckbox();
          this.cloneSelectedNode.iParent = this.node.iD;
        } else if (value.action === this.service.action.edit) {
          this.cloneSelectedNode = this.cloneNode(this.node);
          this.defaultValueOnEdit(this.nodeFrm);
          this.loadNode();
          this.initAoi(value);
          this.initAttributes();
          this.initCheckbox();
        }
      }

    }
  }



  constructor(public service: SharedService, private cdRef: ChangeDetectorRef) {
    super(service);
    this.initOnAdd();
  }

  ngOnInit() {
    this.onChanges();

  }
  cloneNode(item: NodeTree) {
    return {
      label: item.label,
      iParent: item.iParent,
      iD: item.iD,
      iType: item.iType,
      iSubType: item.iSubType,
      iFunction: item.iFunction,
      sEU: item.sEU,
      dMin: item.dMin,
      dMax: item.dMax,
      dMul: item.dMul,
      sExp: item.sExp,
      sProgram: item.sProgram,
      TagName: item.TagName,
      UID: item.UID,
      iStartD: item.iStartD,
      bHasTrigger: item.bHasTrigger,
      updateRate: item.updateRate,
      isMulp: item.isMulp,
      InternalIndex: item.InternalIndex,
      children: item.children,
      oTreeNode: item.oTreeNode,
      rung: item.rung,
      routine: item.routine,
      sProgramParent: item.sProgramParent,
      sParentTagName: item.TagName,
      updateRadio: item.updateRadio,
      isAoi: item.isAoi,
      nameAoi: item.nameAoi,
      lInfoAtt: item.lInfoAtt,
      isInjected: item.isInjected
    };
  }
  loadNode() {
    if (this.cloneSelectedNode.updateRate > 0) {
      if (this.cloneSelectedNode.bHasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[3];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[2];
      }
    } else if (this.cloneSelectedNode.updateRate == 0) {
      if (this.cloneSelectedNode.bHasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[0];
      }
    } else {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[4];
    }
  }
  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[2];
    return this.deleteMinus(e, num);
  }

  onChanges(): void {
    this.nodeFrm.valueChanges
      .subscribe((value) => {
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.iD = this.nodeiD;
        this.checkAndSend();
      });
  }


  onChangeSelect(e) {
    if (e.value === this.arrayOfRadioBtns[4]) {
      this.isEnableTriggerInput(true, true, 0);
    } else if (e.value === this.arrayOfRadioBtns[0]) {
      this.isEnableTriggerInput(false, false, 0);
    } else if (e.value === this.arrayOfRadioBtns[1]) {
      this.isEnableTriggerInput(true, false, 0);
    } else if (e.value === this.arrayOfRadioBtns[2]) {
      this.isEnableTriggerInput(false, false, this.cloneSelectedNode.updateRate);
    } else if (e.value === this.arrayOfRadioBtns[3]) {
      this.isEnableTriggerInput(true, false, this.cloneSelectedNode.updateRate);
    }
    this.sendSmartTagData(this.nodeFrm);
  }

  getCurrentValue(e) {
    if (e.target.value > 0) {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[2];
    }
    this.tempValueOfRadio = e.target.value;
    if (this.selectedOption === 'ms') {
      this.tempValueOfRadio = this.tempValueOfRadio / 1000;
    }
    if (this.selectedOption === 'min') {
      this.tempValueOfRadio = this.tempValueOfRadio * 60;
    }

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
      if (this.formAction['type'] === 'node') {
        this.sendSmartTagData(this.nodeFrm);
      }
    }
  }
}
