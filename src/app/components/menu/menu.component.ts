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
  @Output() onReconnect = new EventEmitter();
  @Input() set actionOnClicked(value) {
    if (value) {
      if (value.action === 'added') {
        if (value.component == 'model') {
          this.setPropertyMenu(true, false, true, false);
        } else {
          this.setPropertyMenu(false, false, true, true);
        }
      }
      if (value.action === 'edited') {
        if (value.component == 'model') {
          this.setPropertyMenu(true, false, true, false);
        } else {
          this.setPropertyMenu(false, false, true, true);
        }
      }
    }
  }
  @Input() disableBtnOnError;
  blockOnConnecting = false;
  @Input() set onReconnectLoading(value) {
    this.blockOnConnecting = value;
  }
  @Input() set onOfflineDisableBtn(value) {
    this.disableBtn = value;
  }
  @Input() set onOfflineHideAoi(value) {
    this.hideAoi = value;
  }
  @Input() set onShowedAOI(value) {
    if (value) {
      if (value.emit) {
        this.setPropertyMenu(false, false, this.hideForm, true);
      } else {
        this.setPropertyMenu(true, false, this.hideForm, false);
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
  hideAOI = true;
  showTabAOI = false;
  hideAoi = false;
  disableBtn = false;

  constructor(private service: SharedService) {
    this.service.SubjectControlTab.subscribe((value) => {
      if (value === 'show_form') {
        this.setPropertyMenu(false, true, false, false);
      } else if (value === 'hide_form_model') {
        this.setPropertyMenu(this.showTabTree, false, true, false);
      } else if (value === 'hide_form_aoi') {
        this.setPropertyMenu(this.showTabTree, false, this.hideForm, true);
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

  saveToHdrive() {
    let data = {};
    this.service.saveToHdrive(data).subscribe(val => {
      if (val == null) return;
      if (val) {
        this.service.sendNotification('Data saved!', 'success');
      } else {
        this.service.sendNotification('Something went wrong!', 'fail');
      }
    });
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
      this.service.StartCollectData(this.version).subscribe((value) => {
        if (!value) this.service.sendNotification('Can\'t write a file!', 'fail');
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
      this.service.StopCollectData(this.version).subscribe((value) => {
        if (value) {
          this.service.sendNotification('Data saved!', 'success');
        } else {
          this.service.sendNotification('Something went wrong!', 'fail');
        }
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
  openTab(tab) {
    if (tab === 'model-tree') {
      this.contentSelected.emit('model-tree');
      this.setPropertyMenu(true, false, this.hideForm, false);
    } else if (tab === 'smart-tag-editor') {
      this.contentSelected.emit('smart-tag-editor');
      this.setPropertyMenu(false, true, this.hideForm, false);
    } else if (tab === 'aoi') {
      this.contentSelected.emit('aoi');
      this.setPropertyMenu(false, false, this.hideForm, true);
    }
  }
  setPropertyMenu(tabTree, tabOper, hideForm, aoi) {
    this.showTabTree = tabTree;
    this.showTabOperation = tabOper;
    this.hideForm = hideForm;
    this.showTabAOI = aoi;
  }
  Reconnect() {
    this.onReconnect.emit(true);
  }
}


