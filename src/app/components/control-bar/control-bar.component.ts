import { SharedService } from './../../providers/shared.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss']
})
export class ControlBarComponent implements OnInit {
  disableBtnAddEdit = true;
  disableBtnNav = false;
  dataForm: any;
  operation;
  content = { navigate: false, edit: false, add: false };
  showSpinner = false;
  treePost;
  isChangesAllowed = true;
  @Output() showMsgChangesNotAllowed = new EventEmitter();

  @Input() set selectedContent(value) {
    this.content = value;
    if (value && this.operation['isValid'] === 'VALID') {
      this.disableBtnAddEdit = false;
    }
  }
  @Output() submitForm = new EventEmitter();
  @Input() set TreeOnPost(tree) {
    this.treePost = tree;
  }
  @Input() changesAllowed;

  constructor(private service: SharedService) {
    this.onEditForm();
  }

  ngOnInit() {
  }

  onEditForm() {
    this.service.SubjectOperationOnForm.subscribe((value) => {
      console.log(value);
      this.operation = value;
      if (value['isValid'] === 'VALID') {
        this.dataForm = value['body'];
        this.disableBtnAddEdit = false;
        if (this.dataForm.isInjected) {
          this.disableAllBtn();
          this.disableBtnNav = true;
        }
      } else {
        this.disableAllBtn();
      }
    });
  }

  disableAllBtn() {
    this.disableBtnAddEdit = true;
  }
  addNode() {
    console.log('ADDNODE', this.dataForm);
    if (this.changesAllowed) {
      this.showSpinner = true;
      this.disableAllBtn();
      if (this.operation.operation.component == 'model') {
        this.service.addNode(this.dataForm).subscribe((value) => {
          this.responseOnAdd(value);
        },
          err => {
            this.disableBtnAddEdit = false;
            this.onFailed('Addition');
          });
      } else {
        this.service.addAoiNode(this.dataForm).subscribe((value) => {
          this.responseOnAdd(value);
          this.saveAoi();
        },
          err => {
            this.disableBtnAddEdit = false;
            this.onFailed('Addition');
          });
      }
    } else {
      this.showMsgChangesNotAllowed.emit();
    }
  }

  responseOnAdd(value) {
    this.showSpinner = false;
    if (value) {
      this.submitForm.emit({
        'action': 'added',
        'body': this.dataForm,
        'component': this.operation.operation.component
      });
      this.service.sendNotification('Node has been added!', 'success');
      this.disableAllBtn();
    } else {
      this.disableBtnAddEdit = false;
      this.onFailed('Addition');
    }
  }

  updateNode() {
    this.showSpinner = true;
    this.disableAllBtn();
    if (this.operation.operation.component == 'model') {
      this.service.updateNode(this.dataForm).subscribe((value) => {
        this.responseOnEdit(value, true);
        
      },
        err => {
          this.disableBtnAddEdit = false;
          this.onFailed('Edition');
        });
    } else {
      this.service.updateAoiNode(this.dataForm).subscribe((value) => {
        this.responseOnEdit(value, false);
        this.saveAoi();
      },
        err => {
          this.disableBtnAddEdit = false;
          this.onFailed('Edition');
        });
    }
  }


  responseOnEdit(value, isInfoModel) {
    this.showSpinner = false;
    this.disableBtnAddEdit = false;
    if (value) {
      this.disableAllBtn();
      if (isInfoModel) {
        this.submitForm.emit({
          'action': 'edited',
          'body': this.dataForm,
          'component': this.operation.operation.component
        });
      }
    } else {
      this.onFailed('Edition');
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
  navigate() {
    this.disableBtnNav = true;
    this.showSpinner = true;
    this.service.navigate().subscribe((value) => {
      this.disableBtnNav = false;
      this.showSpinner = false;
      if (value) {
        this.service.sendNotification('Navigated succeed!', 'success');
      } else {
        this.onFailed('Navigation');
      }
    },
      err => {
        this.disableBtnNav = false;
        this.onFailed('Navigation');
      });
  }
  onFailed(op) {
    this.showSpinner = false;
    this.service.sendNotification(op + ' failed!', 'fail');
  }

  saveAoi() {
    let tree = this.parseTreeToServer(this.treePost[0]);
    this.service.saveAOI(tree).subscribe((value) => { });
  }

  parseTreeToServer(tree) {
    let stringifyData = JSON.stringify(tree);
    stringifyData = stringifyData.replace(/label/g, 'nameInModel');
    stringifyData = stringifyData.replace(/children/g, 'lChildrens');
    const object = JSON.parse(stringifyData);
    return object;
  }
}
