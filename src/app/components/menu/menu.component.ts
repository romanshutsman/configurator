import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from './../../providers/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Output() contentSelected = new EventEmitter();
  version: any;
  @Input() set actionOnClicked(value) {
    if (value) {
      if (value.action === 'added') {
        this.showTabTree = true;
        this.showTabOperation = false;
        this.hideForm = true;
      }
      if (value.action === 'edited') {
        this.showTabTree = true;
        this.showTabOperation = false;
        this.hideForm = true;
      }
    }
  }

  active: boolean;
  totalValueSubsr: Subscription;
  intervalNode: any;
  showTabTree = true;
  showTabOperation = false;
  hideForm = true;


  constructor(private service: SharedService) {
    this.service.SubjectControlTab.subscribe((value) => {
      if (value === 'show_form') {
        this.showTabTree = false;
        this.showTabOperation = true;
        this.hideForm = false;
      } else if (value === 'hide_form') {
        this.hideForm = true;
        this.showTabOperation = false;
      }
    });
  }

  ngOnInit() {
  }
  onConnect() {
    this.service.connectVersionsofControllers().subscribe(data => {
      console.log('Connect controller ', data);
      this.service.SubjectOnConnect.next(data);
    },
      error => {
        console.log(error);
        this.service.SubjectOnConnect.next('error');
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
      });
  }
  collectData(e) {
    if (e) {
      this.switchOn();
    } else {
      this.switchOff();
    }
  }
  intervalStatus(data: boolean) {
    if (data) {
      this.intervalNode = setInterval(() => {
        if (this.totalValueSubsr)
          this.totalValueSubsr.unsubscribe();
        this.totalValueSubsr = this.service.getStatus().subscribe((value) => {
          console.log(value);
          if (value['total']) {
            // const body = { 'msg': 'Collecting data...', 'type': 'info', 'total': value['total'] };
            // this.service.SubjectNotifications.next(body);
            this.service.sendNotification('Collecting data...', 'info', value['total']);
          }
        })
      }, 2000)
    } else {
      if (this.totalValueSubsr)
        this.totalValueSubsr.unsubscribe();
      clearInterval(this.intervalNode)
    }
  }
  switchOn() {
    this.intervalStatus(true);
    this.getVersion();
    if (this.version) {
      this.service.sendNotification('Collecting data', 'info');
      this.active = true;
      console.log('ON:', this.version);
      this.service.switchOnController(this.version).subscribe((value) => {
        console.log('API ON:', value);
      });
    } else {
      this.service.sendNotification('Can\'t write a file!', 'fail');
    }
  }
  switchOff() {
    this.intervalStatus(false);
    this.getVersion();
    if (this.version) {
      // const body = { 'msg': 'Data saved!', 'type': 'info' };
      // this.service.SubjectNotifications.next(body);
      this.service.sendNotification('Data saved!', 'info');
      this.active = false;
      this.service.switchOffController(this.version).subscribe((value) => {
        console.log('API OFF:', value);
      });
    } else {
      // const body = { 'msg': 'Something went wrong!', 'type': 'fail' };
      // this.service.SubjectNotifications.next(body);
      this.service.sendNotification('Something went wrong!', 'fail');
    }
  }
  getVersion() {
    this.service.SubjectTransferVersion.subscribe((value) => {
      this.version = value;
    });
  }
  openTab(e, tab) {
    if (tab === 'model-tree') {
      this.contentSelected.emit('model-tree');
      this.showTabTree = true;
      this.showTabOperation = false;
    } else if (tab === 'smart-tag-editor') {
      this.contentSelected.emit('smart-tag-editor');
      this.showTabTree = false;
      this.showTabOperation = true;
    }
  }
}


