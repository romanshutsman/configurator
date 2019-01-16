
import { NodeTree, RealStateDintNode } from 'src/app/providers/node.interface';
import { ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { NgForm, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/providers/shared.service';

export class BaseSmartTag {
  parentOfNode: NodeTree;
  @Input() set cloneSelected(value: RealStateDintNode) {
    if (value) {
      this.cloneSelectedNode = value;
      this.nodeiD = this.cloneSelectedNode.iD;
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
    'Parent + Trigger',
    'Rate',
    'Rate + Trigger',
    'Trigger Only'
  ];
  arrayOfRadioBtns2 = [
    'Parent',
    'Parent + Change',
    'Rate',
    'Rate + Change',
    'Change Only'
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
  showPopUpAttr = false;

  constructor(public service: SharedService) {
    this.getITypes();
  }

  initOnAdd() {
    this.cloneSelectedNode = {
      label: '',
      iParent: 0,
      iD: 0,
      iType: 0,
      iSubType: 0,
      iFunction: 0,
      sEU: '',
      dMin: 0,
      dMax: 0,
      dMul: 0,
      sExp: false,
      sProgram: '',
      TagName: '',
      UID: 0,
      iStartD: 0,
      bHasTrigger: false,
      updateRate: 0,
      isMulp: false,
      InternalIndex: 0,
      children: [],
      oTreeNode: '',
      routine: '',
      rung: 0,
      sProgramParent: '',
      sParentTagName: '',
      updateRadio: 'Rate',
      isAoi: false,
      nameAoi: null,
      lInfoAtt: [],
      isInjected: false
    };
  }
  getOptionTime(e) {
    this.selectedOption = e.value;
    this.calculateTime(this.selectedOption);
  }
  calculateTime(time) {
    if (time === this.times[0]) {
      this.cloneSelectedNode.updateRate = this.tempValueOfRadio / 60;
    } else if (time === this.times[1]) {
      this.cloneSelectedNode.updateRate = this.tempValueOfRadio;
    } else if (time === this.times[2]) {
      this.cloneSelectedNode.updateRate = this.tempValueOfRadio * 1000;
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
      console.log('HERE');
      this.formComp.controls[control].clearValidators();
      this.formComp.controls[control].updateValueAndValidity();
      console.log(this.formComp);
    }
  }
  loadValue() {
    if (this.cloneSelectedNode.updateRate > 0) {
      if (this.cloneSelectedNode.bHasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[3];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[2];
      }
    } else if (this.cloneSelectedNode.updateRate == 0) {
      if (this.cloneSelectedNode.bHasTrigger) {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[1];
      } else {
        this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[0];
      }
    } else {
      this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns[4];
    }
    console.log(this.cloneSelectedNode);
  }

  defaultValueOnAdd(form, radio) {
    this.initOnAdd();
    this.enableReuiredItems(form);
    this.service.getInfoNode(this.nodeiD)
      .subscribe((data: any) => {
        this.programs = data['Programs'];
        this.routines = data['Routines'];
        this.routineDefault = this.routines[0];
        if (this.programs.length > 0) {
          const defaltProgramIndex: any = this.programs.findIndex(i => i === this.node.sProgram);
          this.cloneSelectedNode.sProgram = this.programs[defaltProgramIndex];
        }
      });
    this.cloneSelectedNode.updateRadio = radio[2];
    this.cloneSelectedNode.sProgramParent = this.node.sProgram;
    this.cloneSelectedNode.sParentTagName = this.node.TagName;
    this.disableGroupBtn(false);
  }
  defaultValueOnEdit(form) {
    this.disableReuiredItems(form);
    this.service.getInfoOnEditNode(this.cloneSelectedNode.iD)
      .subscribe((data: any) => {
        console.log(data);
      });
    this.routineDefault = this.routines[0];
    this.cloneSelectedNode.updateRadio = this.arrayOfRadioBtns2[2];
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
    this.cloneSelectedNode.bHasTrigger = trig;
    this.inputDisable = inp;
    this.cloneSelectedNode.updateRate = num;
  }
  // getParentSelectedNode(node: NodeTree) {
  //   this.parentOfNode = node;
  //   console.log(this.parentOfNode)
  // }
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
    this.typesOfCheckboxesAOI.forEach(e => {
      // e.selected = false;
      let selected = this.cloneSelectedNode.lInfoAtt.find(i => i.name == e.Name);
      e.selected = !!selected;
    })
  }
  getITypes() {
    this.service.getInfoTypes().subscribe((value: any) => {
      this.typesOfCheckboxesAOI = JSON.parse(value);
      this.typesOfCheckboxesAOI.forEach(e => {
        e.selected = false;
      })
    })
    // this.typesOfCheckboxesAOI = [
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
    console.log('dcds')
    this.showPopUpAttr = true;
  }
  closeModal1() {
    this.showPopUpAttr = false;
  }
}
