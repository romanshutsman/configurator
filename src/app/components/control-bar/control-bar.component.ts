import { NodeTree } from './../../providers/node.interface';
import { SharedService } from './../../providers/shared.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss']
})
export class ControlBarComponent implements OnInit {
  disableBtnAdd = true;
  disableBtnEdit = true;
  disableBtnNav = false;
  dataForm: any;
  operation;
  content = { navigate: false, edit: false, add: false };
  showSpinner = false;
  treePost;

  @Input() set selectedContent(value) {
    this.content = value;
    if (value && this.operation['isValid'] === 'VALID') {
      this.checkOperation(this.operation['operation']['action']);
    }
  }
  @Output() submitForm = new EventEmitter();
  @Input() set TreeOnPost(tree) {
    this.treePost = tree;
  }

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
        console.log(this.dataForm);
        this.checkOperation(value['operation']['action']);
      } else {
        this.disableAllBtn();
      }
    });
  }
  checkOperation(compare) {
    if (compare === 'add') {
      this.disableBtnAdd = false;
      this.disableBtnEdit = true;
    }
    if (compare === 'edit') {
      this.disableBtnAdd = true;
      this.disableBtnEdit = false;
    }
  }
  disableAllBtn() {
    this.disableBtnAdd = true;
    this.disableBtnEdit = true;
  }
  addNode() {
    console.log('ADDNODE', this.dataForm);
    this.showSpinner = true;
    this.disableAllBtn();
    if (this.operation.operation.component == 'model') {
      this.service.addNode(this.dataForm).subscribe((value) => {
        this.responseOnAdd(value, true);
      },
        err => {
          this.disableBtnAdd = false;
          this.onFailed('Addition');
        });
    } else {
      this.onAddSubmit()
    }
  }
  async onAddSubmit() {
    this.submitForm.emit({
      'action': 'added',
      'body': this.dataForm,
      'component': this.operation.operation.component
    });
    while (!this.treePost) {
      await this.waitingTreeAsync(100);
    }
    const tree = this.parseTreeToServer(this.treePost);
    console.log(tree)
    this.service.saveAOI(tree).subscribe((value) => {
      this.responseOnAdd(value, false)
    },
      err => {
        this.disableBtnAdd = false;
        this.onFailed('Addition');
      });
  }
  parseTreeToServer(tree) {
    console.log(tree[0]);
    let stringifyData = JSON.stringify(tree[0]);
    stringifyData = stringifyData.replace(/label/g, 'nameInModel');
    stringifyData = stringifyData.replace(/children/g, 'lChildrens');
    const object = JSON.parse(stringifyData);
    return object;
  }
  responseOnAdd(value, component) {
    this.showSpinner = false;
    this.treePost = undefined;
    if (value) {
      if (component) {
        this.submitForm.emit({
          'action': 'added',
          'body': this.dataForm,
          'component': this.operation.operation.component
        });
      }
      this.service.sendNotification('Node has been added!', 'success');
      this.disableAllBtn();
    } else {
      this.disableBtnAdd = false;
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
          this.disableBtnEdit = false;
          this.onFailed('Edition');
        });
    } else {
      this.onEditSubmit()
    }
  }
  async onEditSubmit() {
    this.submitForm.emit({
      'action': 'edited',
      'body': this.dataForm,
      'component': this.operation.operation.component
    });
    while (!this.treePost) {
      await this.waitingTreeAsync(100);
    }
    const tree = this.parseTreeToServer(this.treePost);
    console.log(tree);
    this.service.saveAOI(tree).subscribe((value) => {
      this.responseOnEdit(value, false);
    },
      err => {
        this.disableBtnEdit = false;
        this.onFailed('Edition');
      });
  }
  responseOnEdit(value, component) {
    this.showSpinner = false;
    this.disableBtnEdit = false;
    this.treePost = undefined;
    if (value) {
      if (component) {
        this.submitForm.emit({
          'action': 'edited',
          'body': this.dataForm,
          'component': this.operation.operation.component
        });
      }
      this.service.sendNotification('Node has been changed!', 'success');
      this.disableAllBtn();
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
}
