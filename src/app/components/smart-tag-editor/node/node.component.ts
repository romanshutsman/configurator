import { BaseSmartTag } from './../base-smart-tag';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NodeTree } from 'src/app/providers/node.interface';
import { NgForm, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./../state/state.component.scss', './node.component.scss']
})
export class NodeComponent extends BaseSmartTag implements OnInit {
  
  typesOfCheckboxes = [];
  @ViewChild('nodeForm') public nodeFrm: NgForm;


  @Input() set actionMenu(value) {
    if (value) {
      this.editorComponent = value['component'];
      console.log(value);
      this.formAction = value;
      if (value.type == 'node') {
        if (value.action === this.service.action.add) {
          this.isAdding = true;
          this.defaultValueOnAdd(this.nodeFrm, this.arrayOfRadioBtns);
          this.cloneSelectedNode.ParentID = this.node.ID;
        } else if (value.action === this.service.action.edit) {
          this.isAdding = false;
          this.cloneSelectedNode = this.service.cloneNode(this.node);
          this.defaultValueOnEdit(this.nodeFrm);
        }
        this.initData(value);
      }

    }
  }


  constructor(public service: SharedService, private cdRef: ChangeDetectorRef) {
    super(service);
    this.initOnAdd();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.onChanges();
  }

  removeMinus(e, num) {
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    return this.deleteMinus(e, num);
  }

  onChanges(): void {
    this.subscription =
    this.nodeFrm.valueChanges
      .subscribe((value) => {
        this.cloneSelectedNode.routine = this.routineDefault;
        this.cloneSelectedNode.ID = this.nodeiD;
        this.cloneSelectedNode.Type = 0;
        this.checkAndSend();
      });
  }


  onChangeSelect(e) {
    this.onUpdateByChanged(e, this.nodeFrm);
  }

  getCurrentValue(e) {
    if (e.target.value > 0) {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    }
    // this.tempValueOfRadio = e.target.value;
    // if (this.selectedOption === 'ms') {
    //   this.tempValueOfRadio = this.tempValueOfRadio / 1000;
    // }
    // if (this.selectedOption === 'min') {
    //   this.tempValueOfRadio = this.tempValueOfRadio * 60;
    // }

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
