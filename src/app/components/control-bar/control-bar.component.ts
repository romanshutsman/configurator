import { SharedService } from './../../providers/shared.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApiResponse, ApiMessage } from 'src/app/providers/api-response-model';

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
  @Output() notification = new EventEmitter<ApiMessage>();

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
      this.service.addNode(this.dataForm).subscribe((value: ApiResponse<any>) => {
        this.responseOnAdd(value);
      },
        err => {
          this.disableBtnAddEdit = false;
          this.service.sendNotification(undefined);
        });
    } else {
      this.showMsgChangesNotAllowed.emit();
    }
  }

  responseOnAdd(value: ApiResponse<any>) {
    this.showSpinner = false;
    if (value) {
      this.submitForm.emit({
        'action': 'added',
        'body': this.dataForm,
        'component': this.operation.operation.component,
        'id': value.Result
      });

      this.disableAllBtn();
    } else {
      this.disableBtnAddEdit = false;
      this.showSpinner = false;
    }
    this.notification.emit(value.Message);
  }

  updateNode() {
    this.showSpinner = true;
    this.disableAllBtn();
    this.service.updateNode(this.dataForm).subscribe((value: ApiResponse<any>) => {
      this.responseOnEdit(value);
    },
      err => {
        this.disableBtnAddEdit = false;
        this.service.sendNotification(undefined);
      });
  }


  responseOnEdit(value: ApiResponse<any>) {
    this.showSpinner = false;
    this.disableBtnAddEdit = false;
    this.notification.emit(value.Message);
    if (value && value.Result) {
      this.disableAllBtn();
      this.submitForm.emit({
        'action': 'edited',
        'body': this.dataForm,
        'component': this.operation.operation.component
      });
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
    this.service.navigate().subscribe((value: ApiResponse<boolean>) => {
      this.showSpinner = false;
      this.disableBtnNav = false;
      this.notification.emit(value.Message);
    },
      err => {
        this.disableBtnNav = false;
        this.disableBtnNav = false;
        this.service.sendNotification(undefined);
      });
  }

}
