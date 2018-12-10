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
  content = {navigate: false, edit: false, add: false};
  showSpinner = false;

  @Input() set selectedContent(value) {
    this.content = value;
    if(value && this.operation['isValid'] === 'VALID') {
      this.checkOperation(this.operation['operation']['action']);
    } 
  }
  @Output() actionOnClick = new EventEmitter();

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
    this.service.addNode(this.dataForm).subscribe((value) => {
      this.showSpinner = false;
      if(value) {
        this.actionOnClick.emit({'action': 'added', 'body': this.dataForm});
        this.service.sendNotification('Node has been added!', 'success');
        this.disableAllBtn();
      } else {
        this.service.sendNotification('Addition failed!', 'fail');
        this.disableBtnAdd = false;
      }
    },
    err => {
      this.showSpinner = false;
      this.service.sendNotification('Addition failed!', 'fail');
      this.disableBtnAdd = false;
    });
  }
  
  updateNode() {
    console.log('EDITNODE', this.dataForm);
    this.showSpinner = true;
    this.disableAllBtn();
    this.service.updateNode(this.dataForm).subscribe((value) => {
      this.showSpinner = false;
      this.disableBtnEdit = false;
      if(value) {
        this.actionOnClick.emit({'action': 'edited', 'body': this.dataForm});
        this.service.sendNotification('Node has been changed!', 'success');
        this.disableAllBtn();
      } else {
        this.service.sendNotification('Edition failed!', 'fail');
      }
    },
    err =>  {
      this.showSpinner = false;
      this.disableBtnEdit = false;
      this.service.sendNotification('Edition failed!', 'fail');
    });
  }
  navigate() {
    this.disableBtnNav = true;
    this.showSpinner = true;
    this.service.navigate().subscribe((value) => {
      this.disableBtnNav = false;
      this.showSpinner = false;
      if(value) {
        this.service.sendNotification('Navigated succeed!', 'success');
      } else {
        this.service.sendNotification('Navigation failed!', 'fail');
      }
    },
    err =>  {
      this.disableBtnNav = false;
      this.showSpinner = false;
      this.service.sendNotification('Navigation failed!', 'fail');
    });
  }
}
