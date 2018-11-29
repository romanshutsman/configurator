import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
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
  @Output() postController = new EventEmitter();
  @Input() set connectController(value: any) {
    if (value) {
      this.list = value.list;
      this.show = value.show;
      this.message = value.message;
      this.showConnect = value.showConnect;
      if (value.message == 'Can\'t connect to controller!') {
        this.controller = '';
      }
    }
  }

  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  choose(item) {
    this.controller = item.Version;
    this.cdRef.detectChanges();
    this.postController.emit(item);
    setTimeout(() => {
      this.show = false;
      this.cdRef.detectChanges();
    }, 3000);
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
