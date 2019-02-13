
import { NodeTree, RealStateDintNode } from 'src/app/providers/node.interface';
import { Input } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';
import {Subscription} from 'rxjs'

export class BaseSmartTag {
  parentOfNode: NodeTree;
  oldProgram;
  @Input() set cloneSelected(value: RealStateDintNode) {
    if (value) {
      this.cloneSelectedNode = value;
      this.nodeiD = this.cloneSelectedNode.ID;
    }
  }
  @Input() set getPathNode(value) {
    if (value) {
      this.pathNode = value;
    }
  }
  @Input() set oldNode(value) {
    if (value) {
      console.log('OLD', this.node)
      this.node = value;
    }
  }
  @Input() getParentNode;
  public formComp: NgForm;
  arrayOfRadioBtns = [
    'Parent',
    'Rate',
    'Nothing'
  ];
  times = [
    'min',
    'sec',
    'ms'];
  arrayOfCheckedCheckboxes = [];
  valueOfRadio = 0;
  valueOfRung = 0;
  routineDefault: string;
  programDefault: string;
  timeDefault: any;
  updateRadio: string;
  inputDisable = false;
  routines = [];
  programs = [];
  cloneSelectedNode: NodeTree = this.service.initNode;
  pathNode: string;
  node: NodeTree = this.service.initNode;
  detailsOfNode: any;
  tagnameDisable = false;
  programNameDisabled = false;
  routineDisabled = false;
  formAction: string;
  tempValueOfRadio: number;
  selectedOption: string;
  nodeiD: number;
  isRequired = true;
  ValueTypeReal = ['Value', 'Totalizer'];
  ValueTypeStateDint = ['Value', 'Totalizer', 'State'];
  engeneringUnits = ['%'];
  testNamePattern = /^[A-Za-z_][A-Za-z0-9\s]{0,39}$/;
  typesOfCheckboxesAOI = [];
  typesOfCheckboxes = [];
  showPopUpAttr = false;
  hasChange = false;
  logIn = false;
  allPrograms;
  editorComponent: string;
  isAdding: boolean = false;
  nodeType: string;
  subscription: Subscription

  @Input() set getProgram(value) {
    if (value) {
      this.allPrograms = value;
    }
  }

  constructor(public service: SharedService) {
    this.getITypes();
  }

  initOnAdd() {
    let type = this.cloneSelectedNode.Type;
    this.cloneSelectedNode = Object.assign({}, this.service.initNode);
    this.cloneSelectedNode.children = [];
    this.cloneSelectedNode.lInfoAtt = [];
    this.cloneSelectedNode.Type = type;

    this.typesOfCheckboxesAOI.forEach(e => {
      e.selected = false;
    });
  }

  getOptionTime(e) {
    this.selectedOption = e.value;
    this.calculateTime(this.selectedOption);
  }
  calculateTime(time) {
    if (time === this.times[0]) {
      this.cloneSelectedNode.updateRateSeconds = this.cloneSelectedNode.updateRate * 60;
    } else if (time === this.times[1]) {
      this.cloneSelectedNode.updateRateSeconds = this.cloneSelectedNode.updateRate;
    } else if (time === this.times[2]) {
      this.cloneSelectedNode.updateRateSeconds = this.cloneSelectedNode.updateRate * 1000;
    }
  }
  enableReuiredItems(form: NgForm) {
    this.formComp = form;
    this.isRequired = true;
    this.setUpdateValidator('sProgram');
    this.setUpdateValidator('routine');
    this.setUpdateValidator('rung');
  }
  disableReuiredItems(form: NgForm) {
    this.formComp = form;
    this.isRequired = false;
    this.clearUpdateValidator('sProgram');
    this.clearUpdateValidator('routine');
    this.clearUpdateValidator('rung');

  }
  setUpdateValidator(control) {
    if (this.formComp.controls[control]) {
      this.formComp.controls[control].setValidators(Validators.required);
      this.formComp.controls[control].updateValueAndValidity();
    }
  }
  clearUpdateValidator(control) {
    if (this.formComp.controls[control]) {
      this.formComp.controls[control].clearValidators();
      this.formComp.controls[control].updateValueAndValidity();
    }
  }
  loadValue() {
    if (this.cloneSelectedNode.updateRate > 0) {
      if (this.cloneSelectedNode.hasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
      }
    } else if (this.cloneSelectedNode.updateRate == 0) {
      if (this.cloneSelectedNode.hasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[0];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[0];
      }
    } else {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[2];
    }
  }

  defaultValueOnAdd(form: NgForm, radio) {
    this.resetForm(form);
    this.timeDefault = this.times[1];
    this.initOnAdd();
    this.enableReuiredItems(form);
    this.routineDefault = '';
    if (!this.cloneSelectedNode.isAoi)
      this.service.getInfoNode(this.nodeiD)
        .subscribe((program: string) => {
          if (this.nodeiD !== 1) {
            this.cloneSelectedNode.Program = program;
          }
          this.programs = this.allPrograms['programs'];
          const found = this.allPrograms['programs'].filter(i => i.Name == this.cloneSelectedNode.Program);
          if (found.length > 0) {
            this.routines = found[0].Routines;
            this.routineDefault = found[0].Routines[0];
          }
        });
    this.cloneSelectedNode.updateRadio = radio[0];
    this.disableGroupBtn(false);
  }
  resetForm(form: NgForm) {
    form.resetForm();
    form.form.updateValueAndValidity();
    form.form.markAsUntouched();
    form.form.markAsPristine();
    if(form.controls['rung']) form.controls['rung'].setValue(0)
    if(form.controls['updateRate']) form.controls['updateRate'].setValue(0)
    if(form.controls['delta']) form.controls['delta'].setValue(0)
    if(form.controls['mulval']) form.controls['mulval'].setValue(0)  
  }
  onSelectedProgram(e) {
    this.oldProgram = String(this.cloneSelectedNode.Program);
    const found = this.programs.filter(i => i.Name == e.value);
    if (found.length > 0) {
      this.routines = found[0].Routines;
      this.routineDefault = found[0].Routines[0];
    }
  }
  defaultValueOnEdit(form) {
    this.timeDefault = this.times[1];
    this.disableReuiredItems(form);
    this.service.getInfoOnEditNode(this.cloneSelectedNode)
      .subscribe((data: any) => {
        console.log(this.cloneSelectedNode);
        console.log(data);
        let l = this.cloneSelectedNode.label;
        let li = this.cloneSelectedNode.labelInfo;
        let updateBy = this.cloneSelectedNode.updateRadio;
        this.cloneSelectedNode = Object.assign({}, data);
        this.cloneSelectedNode.label = l;
        this.cloneSelectedNode.labelInfo = li;
        this.cloneSelectedNode.updateRate = Math.abs(this.cloneSelectedNode.updateRate);
        this.cloneSelectedNode.updateRadio = updateBy;
        this.initAttributes();
      });
    this.routineDefault = this.routines[0];
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[1];
    this.disableGroupBtn(true);
    this.loadValue();
  }

  disableGroupBtn(bool) {
    this.tagnameDisable = bool;
    this.programNameDisabled = bool;
    this.routineDisabled = bool;
  }
  deleteMinus(e, num) {
    const code1 = 'NumpadSubtract';
    const code2 = 'Minus';
    if (num === 1) {
      if (e.code === code1 || e.code === code2) {
        this.tempValueOfRadio = 0;
        this.valueOfRadio = 0;
        return false;
      }
    }
    if (num === 2) {
      if (e.code === code1 || e.code === code2) {
        this.valueOfRung = 0;
        return false;
      }
    }
  }

  sendSmartTagData(form) {
    this.service.SubjectOperationOnForm.next({
      'isValid': form.valid ? 'VALID' : 'INVALID',
      'body': this.cloneSelectedNode,
      'operation': this.formAction
    });
  }

  onUpdateByChanged(e, form) {
    if (e.value != this.arrayOfRadioBtns[1])
      this.isEnableTriggerInput(false, 0);
    this.sendSmartTagData(form);
  }

  isEnableTriggerInput(inp, num) {
    this.inputDisable = inp;
    this.cloneSelectedNode.updateRate = num;
  }

  initAoi(value) {
    if (value.component == 'model') {
      this.cloneSelectedNode.isAoi = false;
      this.cloneSelectedNode.nameAoi = null;
    } else if (value.component == 'aoi') {
      this.cloneSelectedNode.isAoi = true;
      this.cloneSelectedNode.nameAoi = value.aoi;
    }
  }
  initAttributes() {
    try {
      if (this.typesOfCheckboxesAOI.length > 0)
        this.typesOfCheckboxesAOI.forEach(e => {
          let selected = this.cloneSelectedNode.lInfoAtt.find(i => i.name == e.Name);
          e.selected = !!selected;
          e.Value = selected ? selected.value : null;
        })
    } catch (error) {
      // console.log(error)
    }
  }
  getITypes() {
    this.service.getInfoTypes().subscribe((value: any) => {
      if (value) {
        this.typesOfCheckboxesAOI = JSON.parse(value);
        this.typesOfCheckboxes = JSON.parse(value);
        this.typesOfCheckboxesAOI.forEach(e => {
          e.selected = false;
        })
      } else {
        this.typesOfCheckboxesAOI = undefined;
        this.service.sendNotification('Cant load information types!', 'fail')
      }
    }, err => {
      this.service.sendNotification('Cant load information types!', 'fail')
      this.typesOfCheckboxesAOI = undefined;
    })
  }
  updateInfoTypes(e, item) {
    if (e.checked == true) {
      const newItem = { name: item.Name, value: undefined };
      if (item.HasValue === 1) newItem['value'] = item.Value;

      let el = this.cloneSelectedNode.lInfoAtt.find(e => e.name == item.Name);
      if (el) return;
      this.cloneSelectedNode.lInfoAtt.push(newItem);
    } else if (e.checked == false) {
      this.cloneSelectedNode.lInfoAtt = this.cloneSelectedNode.lInfoAtt.filter(el => el.name !== item.Name);
    }
  }
  updateChecked(item) {
    if (!this.cloneSelectedNode.lInfoAtt || this.cloneSelectedNode.lInfoAtt.length < 1) return false;
    let el = this.cloneSelectedNode.lInfoAtt.find(i => i.name == item.Name);
    return el ? true : false;
  }
  showMore() {
    this.showPopUpAttr = true;
  }
  closeModal1() {
    this.showPopUpAttr = false;
  }
  async initCheckbox() {
    try {
      while (this.typesOfCheckboxesAOI.length == 0) {
        await this.waitingTreeAsync(100);
      }
      this.checkboxOnAction();
    } catch (e) {
      // console.log(e)
    }
  }
  waitingTreeAsync(timer) {
    return new Promise((resolve, reject) => {
      timer = timer || 1500;
      setTimeout(() => {
        resolve()
      }, timer);
    })
  }
  checkboxOnAction() {
    if (this.formAction['action'] == 'add') {
      try {
        if (this.typesOfCheckboxesAOI.length > 0)
          this.typesOfCheckboxesAOI.forEach(e => e.Value = undefined)
      } catch (error) {
        // console.log(error)
      }
    } else {
      this.typesOfCheckboxesAOI = JSON.parse(JSON.stringify(this.typesOfCheckboxes));
    }
    this.initAttributes();
  }

  initData(value) {
    this.initAoi(value);
    this.initAttributes();
    this.initCheckbox();
  }

  getTypeId(type: string): number {
    switch (type) {
      case 'node': return 0;
      case 'real': return 1;
      case 'state': return 2;
      case 'dint': return 2;
      case 'string': return 3;
      case 'real-write': return 4;
      case 'dint-write': return 5;
      default: return 0
    }
  }
  changeCreation(form: NgForm) {
    if(this.cloneSelectedNode.isCreation) {
      this.cloneSelectedNode.Program = ''
      this.programNameDisabled = true;
      form.controls['sProgram'].clearValidators();
      form.controls['sProgram'].updateValueAndValidity();
    } else {
      this.programNameDisabled = false;
      this.cloneSelectedNode.Program = this.oldProgram;
      form.controls['sProgram'].setValidators([Validators.required]);
      form.controls['sProgram'].updateValueAndValidity();
    }
  }
}
