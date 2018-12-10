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
  @Input() set actionOnClicked(value) {
    if (value) {
      if (value.action === 'added') {
        this.setPropertyMenu(true, false, true);
      }
      if (value.action === 'edited') {
        this.setPropertyMenu(true, false, true);
      }
    }
  }
  
  version: any;
  active: boolean;
  totalValueSubsr: Subscription;
  intervalNode: any;
  showTabTree = true;
  showTabOperation = false;
  hideForm = true;


  constructor(private service: SharedService) {
    this.service.SubjectControlTab.subscribe((value) => {
      if (value === 'show_form') {
        this.setPropertyMenu(false, true, false);
      } else if (value === 'hide_form') {
        this.setPropertyMenu(this.showTabTree, true, false);
      }
    });
  }

  ngOnInit() {
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
          if (value) {
            this.service.sendNotification('Collecting data...', 'success', value);
          }
        },
        error => clearInterval(this.intervalNode))
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
      this.service.sendNotification('Collecting data', 'success');
      this.active = true;
      this.service.switchOnController(this.version).subscribe((value) => {
      });
    } else {
      this.service.sendNotification('Can\'t write a file!', 'fail');
    }
  }
  switchOff() {
    this.intervalStatus(false);
    this.getVersion();
    if (this.version) {
      this.service.sendNotification('Data saved!', 'success');
      this.active = false;
      this.service.switchOffController(this.version).subscribe((value) => {
      });
    } else {
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
      this.setPropertyMenu(true, false, this.hideForm);
    } else if (tab === 'smart-tag-editor') {
      this.contentSelected.emit('smart-tag-editor');
      this.setPropertyMenu(false, true, this.hideForm);
    }
  }
  setPropertyMenu(tabTree, tabOper, hideForm) {
    this.showTabTree = tabTree;
    this.showTabOperation = tabOper;
    this.hideForm = hideForm;
  }
}


