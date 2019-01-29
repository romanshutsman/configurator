
import { NodeTree, RealStateDintNode } from 'src/app/providers/node.interface';
import { ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NgForm, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

export class BaseSmartTag {
  parentOfNode: NodeTree;
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
  arrayOfRadioBtns2 = this.arrayOfRadioBtns;
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
  hasTriggerNS = false;
  hasTriggerRSD = false;
  hasChange = false;
  logIn = false;
  allPrograms;

  @Input() set getProgram(value) {
    if(value) {
      this.allPrograms = value;
    }
  }

  constructor(public service: SharedService) {
    this.getITypes();
  }

  initOnAdd() {
    this.cloneSelectedNode = {
      label: '',
      labelEdit: '',
      ParentID: 0,
      ID: 0,
      Type: 0,
      SubType: 0,
      EU: '',
      Min: 0,
      Max: 0,
      Mul: 0,
      Exp: false,
      Program: '',
      TagName: '',
      UID: 0,
      iStartD: 0,
      hasTrigger: false,
      hasChange: false,
      hasBuffer: false,
      isLogIn: false,
      updateRate: 0,
      isMulp: false,
      InternalIndex: 0,
      children: [],
      routine: '',
      rung: 0,
      sProgramParent: '',
      sParentTagName: '',
      updateRadio: 'Rate',
      isAoi: false,
      nameAoi: null,
      lInfoAtt: [],
      isInjected: false,
      Del: null
    };
  }
  getOptionTime(e) {
    this.selectedOption = e.value;
    this.calculateTime(this.selectedOption);
  }
  calculateTime(time) {
    // if (time === this.times[0]) {
    //   this.cloneSelectedNode.updateRate = this.tempValueOfRadio / 60;
    // } else if (time === this.times[1]) {
    //   this.cloneSelectedNode.updateRate = this.tempValueOfRadio;
    // } else if (time === this.times[2]) {
    //   this.cloneSelectedNode.updateRate = this.tempValueOfRadio * 1000;
    // }
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

  defaultValueOnAdd(form, radio) {
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
    this.cloneSelectedNode.updateRadio = radio[2];
    this.cloneSelectedNode.sProgramParent = this.node.Program;
    this.cloneSelectedNode.sParentTagName = this.node.TagName;
    this.disableGroupBtn(false);
  }
  onSelectedProgram(e) {
    const found = this.programs.filter(i => i.Name == e.value);
    if (found.length > 0) {
      this.routines = found[0].Routines;
      this.routineDefault = found[0].Routines[0];
    }
  }
  defaultValueOnEdit(form) {
    this.disableReuiredItems(form);
    this.service.getInfoOnEditNode(this.cloneSelectedNode.ID)
      .subscribe((data: any) => {
        console.log(data);
      });
    this.routineDefault = this.routines[0];
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[1];
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
    this.renameLabel();
    this.service.SubjectOperationOnForm.next({
      'isValid': form.valid ? 'VALID' : 'INVALID',
      'body': this.cloneSelectedNode,
      'operation': this.formAction
    });
  }
  renameLabel() {
    this.cloneSelectedNode.label = this.cloneSelectedNode.labelEdit;
    const regExp = /\(([^)]+)\)/;
    const matches = regExp.exec(this.cloneSelectedNode.label);
    if(matches) {
      const parathesis = matches[0];
      this.cloneSelectedNode.label += ' ' + parathesis;
    }
  }
  onCheckRadio(e, form) {
    if (e.value === this.arrayOfRadioBtns2[4]) {
      this.isEnableTriggerInput(true, true, 0);
    } else if (e.value === this.arrayOfRadioBtns2[0]) {
      this.isEnableTriggerInput(false, false, 0);
    } else if (e.value === this.arrayOfRadioBtns2[1]) {
      this.isEnableTriggerInput(true, false, 0);
    } else if (e.value === this.arrayOfRadioBtns2[2]) {
      this.isEnableTriggerInput(false, false, this.cloneSelectedNode.updateRate);
    } else if (e.value === this.arrayOfRadioBtns2[3]) {
      this.isEnableTriggerInput(true, false, this.cloneSelectedNode.updateRate);
    }
    this.sendSmartTagData(form);
  }
  isEnableTriggerInput(trig, inp, num) {
    this.cloneSelectedNode.hasTrigger = trig;
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
      // this.typesOfCheckboxesAOI  = [
      //   {
      //     Name: 'Summary',
      //     HasValue: 0,
      //     Value: "5123" 
      //   },
      //   {
      //     Name: 'OEE',
      //     HasValue: 0,
      //     Value: "5123"
      //   },
      //   {
      //     Name: 'Sherlock',
      //     HasValue: 1,
      //     Value: "5123"
      //   }
      // ];
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
  filterValueLabel() {
    this.cloneSelectedNode.labelEdit = this.cloneSelectedNode.labelEdit.replace(/ *\([^)]*\) */g, '');
  }
}
