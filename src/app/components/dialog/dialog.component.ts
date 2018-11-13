import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { SharedService } from './../../providers/shared.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  show: boolean = false;
  showConnect: boolean = false;
  list: any = [];
  controller: string;
  message: any;
  @Output() connectController = new EventEmitter();

  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
    this.onConnect();
  }

  ngOnInit() {
  }
  onConnect() {
    this.service.SubjectOnConnect.subscribe(value => {
      if (value) {
        if (value === 'error') {
          this.show = true;
          this.cdRef.detectChanges();
        } else {
          this.list = value;
          this.show = true;
          this.cdRef.detectChanges();
        }
      }
    },
      error => { console.log(error.message) });
  }

  choose(item) {
    this.controller = item.Version;
    this.cdRef.detectChanges();
    const body = {};
    body["Name"] = item.Version;
    this.service.chooseVersionsofControllers(body).subscribe(data => {
      if (data) {
        this.successConnect(data, body, item);
      } else {
        this.service.SubjectLoadTree.next(data);
        this.errorConnect();
      }
    },
      error => {
        this.errorConnect();
      });
    setTimeout(() => {
      this.show = false;
      this.cdRef.detectChanges();
    }, 500);
  }

  errorConnect() {
    this.controller = '';
    this.connectController.emit({ 'status': false, 'project': '' });
    this.message = 'Can\'t connect to controller!';
    this.showConnect = true;
  }

  successConnect(data, body, item) {
    this.connectController.emit({ 'status': true, 'project': item });
    this.service.SubjectLoadTree.next(data);
    this.service.SubjectTransferVersion.next(body);

    this.message = 'Successfully connected!';
    this.cdRef.detectChanges();
    this.showConnect = true;
  }

  closeModal1() {
    this.show = false;
    this.cdRef.detectChanges();
  }

  closeModal2() {
    this.showConnect = false;
    this.cdRef.detectChanges();
  }
}
