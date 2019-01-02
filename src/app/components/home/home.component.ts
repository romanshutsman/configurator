import { NodeTree } from './../../providers/node.interface';
import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';

import { SharedService } from '../../providers/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  treeModel: NodeTree[];
  selectedItem: NodeTree;
  public actionContextMenu: any;
  showTabTree = false;
  showTabOperation = false;
  operationOnForm: string;
  bodyForm: any;
  statusOfController: any;
  showBtn = {};
  onConnect: any;
  controller: string;
  chosenVersion: any;
  listOfControllers = [];
  showTabAOI = false;
  disableBtnOfMenu = false;
  checkStatus;
  onLoading = false;
  onBlocking = false;
  onHideAoi = false;
  onDisableBtn = false;

  constructor(private service: SharedService) {
    this.getActiveControllerAndCheck();
  }
  getTree(e) {
    console.log(e);
    this.treeModel = e;
    this.manageOfBtns(false, false, false);
  }
  getNode(e) {
    this.selectedItem = e;
    this.manageOfBtns(false, false, false);
  }
  actionMenu(e) {
    this.actionContextMenu = e;
    switch (e.action) {
      case this.service.action.add:
        this.manageOfContent(false, true, false);
        this.manageOfBtns(true, false, false);
        break;
      case this.service.action.edit:
        this.manageOfContent(false, true, false);
        this.manageOfBtns(false, true, true);
        break;
      default:
        this.manageOfContent(false, false, true);
        this.manageOfBtns(false, false, false);
        break;
    }
  }
  selectedContent(e) {
    console.log('SELECTED CONTENT', e)
    switch (e) {
      case 'model-tree':
        this.manageOfContent(true, false, false);
        this.manageOfBtns(false, false, false);
        break;
      case 'smart-tag-editor':
        if (this.actionContextMenu) {
          switch (this.actionContextMenu.action) {
            case this.service.action.add:
              this.manageOfBtns(true, false, false);
              break;
            case this.service.action.edit:
              this.manageOfBtns(false, true, true);
              break;
            default:
              this.manageOfBtns(false, false, false);
              break;
          }
        }
        this.manageOfContent(false, true, false);
        break;
      case 'aoi':
        this.manageOfContent(false, false, true);
        break;
      default:
        this.manageOfContent(true, false, false);
        break;
    }
  }
  onSubmitted(e) {
    this.manageOfContent(true, false, false);
    console.log(e);
    this.operationOnForm = e;
    this.bodyForm = e;
    this.manageOfBtns(false, false, false);
    if (e['action'] === 'edited') {
      const node = e['body'];
      this.selectedItem.iFunction = node.iFunction;
      this.selectedItem.label = node.label;
      this.selectedItem.updateRate = node.updateRate;
      this.selectedItem.bHasTrigger = node.bHasTrigger;
    }
  }
  statusController(e) {
    if (e.status) {
      this.manageOfContent(true, false, false);
    }
    this.statusOfController = e;
  }

  getChosenController = controller => this.checkVerification(controller);

  getActiveControllerAndCheck() {
    this.onLoading = true;
    this.onBlocking = true;
    this.service.getActiveControllers().subscribe((data: any) => {
      this.onBlocking = false;
      this.listOfControllers = data;
      if (data.length === 0) {
        const body = { 'Version': '' };
        this.manageMessageDialog([], false, true, 'No active controllers!', false);
        this.checkVerification(body);
        this.disableBtnOfMenu = true;
      } else if (data.length === 1) {
        this.disableBtnOfMenu = false;
        this.manageMessageDialog(data, false, false, '', false);
        this.checkVerification(data[0]);
      } else if (data.length > 1) {
        this.disableBtnOfMenu = false;
        this.manageMessageDialog(data, true, false, '', false);
      }
    },
    error => {
      this.onBlocking = false;
        const body = { 'Version': '' };
        this.manageMessageDialog([], false, true, 'Can\'t connect to controller...', false);
        this.checkVerification(body);
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
        this.disableBtnOfMenu = true;
      });
  }
  successConnect(data, body, item) {
    this.statusController({ 'status': true, 'project': item });
    this.service.SubjectLoadTree.next(data);
    this.service.SubjectTransferVersion.next(body);
  }
  errorConnect() {
    this.statusController({ 'status': false, 'project': '' });
  }

  checkVerification(item) {
    this.chosenVersion = item;
    const bodyTransfer = {};
    const body = {};
    bodyTransfer['Name'] = item.Version;
    body['Version'] = item.Version;
    const foundIndex = this.listOfControllers.findIndex(i => i === item);
    this.service.VerifyLogixInfoServer(foundIndex).subscribe( data => {
      if(data === true) {
        body['State'] = false;
        this.connectingToChosenVersion(body, item, bodyTransfer);
        this.disableBtnOfMenu = false;
      } else if (data === false) {
        // show message
        this.manageMessageDialog([], false, false, 'Could not detect LogixInfoServer Program', true);
        this.disableBtnOfMenu = true;
      } else {
        this.onLoading = false;
        this.manageMessageDialog([], false, true, 'You should set the language first!', false);
        this.disableBtnOfMenu = true;
        this.onDisableBtn = true;
      }
    }, err => {
      this.disableBtnOfMenu = true;
    });
  }
  connectingToChosenVersion(body, item, bodyTransfer) {
    this.service.connectToController(body).subscribe(data  => {
      this.onLoading = false;
      console.log(data);
      console.log(data['Status']);
      console.log(data['']);
      if(data['Status'] != 6) {
        this.onHideAoi = true;
      }
      this.checkStatus = data;
      if (data['Tree']) {
        this.successConnect(data['Tree'], bodyTransfer, item);
        this.disableBtnOfMenu = false;
        // this.manageMessageDialog([], false, true, 'Succesfully connected', false);
      } else {
        this.service.SubjectLoadTree.next(data['Tree']);
        this.errorConnect();
        this.disableBtnOfMenu = true;
        if(item.Version) {
          this.manageMessageDialog([], false, true, 'Can\'t connect to controller...', false);
        } else {
          this.manageMessageDialog([], false, false, '', false);
          
        }
      }
    },
    error => {
      this.onLoading = false;
      this.disableBtnOfMenu = true;
      this.manageMessageDialog([], false, true, 'Can\'t connect to controller...', false);
      if (item.Version !== '') {
        this.errorConnect();
        }
      });
  }
  
  manageMessageDialog(list, show, showConnect, msg, showVerify) {
    this.onConnect = {
      list: list,
      show: show,
      showConnect: showConnect,
      message: msg,
      showVerify: showVerify
    };
  }
  manageOfContent(tabTree, tabForm, tabAoi) {
    this.showTabTree = tabTree;
    this.showTabOperation = tabForm;
    this.showTabAOI = tabAoi;
  }
  manageOfBtns(add, edit, nav) {
    this.showBtn = {
      'add': add,
      'edit': edit,
      'navigate': nav
    };
  }
  verifyingChosenController(e) {
    const bodyTransfer = {};
    const body = {};
    bodyTransfer['Name'] = this.chosenVersion.Version;
    body['Version'] = this.chosenVersion.Version;
    body['State'] = e;
    if(e) {
      this.connectingToChosenVersion(body, this.chosenVersion, bodyTransfer);
    } else {
      this.connectingToChosenVersion(body, this.chosenVersion, bodyTransfer);
    }
  }
  showNewMsg(e) {
    console.log(e);
    if(e) {
      this.manageMessageDialog([], false, true, 'Controller should be offline!', false);
    }
  }
  onReconnecting(e) {
    console.log(e);
    if(e) {
      this.getActiveControllerAndCheck();
    }
  }
}
