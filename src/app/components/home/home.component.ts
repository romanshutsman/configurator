import { NodeTree } from './../../providers/node.interface';
import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';

import { SharedService } from '../../providers/shared.service';
import { Programs } from '../../providers/common.interface';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  treeModel: NodeTree[];
  treeModelPost: NodeTree[];
  selectedItem: NodeTree;
  public actionContextMenu: any;
  showTabTree = true;
  showTabOperation = false;
  operationOnForm: string;
  bodyForm: any;
  statusOfController: any;
  showBtn = {};
  onShowInfoMsg: any;
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
  showAOITab = false;
  responseAoi;
  nameAoi: any;
  pathSelectedItem;
  programsAndRoutines;
  isChangesAllowed = true;

  constructor(private service: SharedService) {
    this.getActiveControllerAndCheck();
  }
  getTree(e) {
    console.log(e);
    this.treeModel = e;
    this.manageOfBtns(false, false, false);
  }

  getTreeOnPost(e) {
    console.log('EMITTED')
    if (this.treeModelPost && this.treeModelPost[0].isAoi) {
      this.treeModelPost = Object.assign({}, e);
    } else {
      this.treeModelPost = e;
    }
  }

  getNode(e) {
    this.selectedItem = e;
    this.pathSelectedItem = Object.assign({}, {path: undefined});
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
    if(e.component == 'model') {
      this.manageOfContent(true, false, false);
    } else {
      this.manageOfContent(false, false, true);
    }
    console.log(e);
    this.operationOnForm = e;
    this.bodyForm = e;
    this.manageOfBtns(false, false, false);
    if (e['action'] === 'edited') {
      const node = e['body'];
      this.selectedItem.label = node.label;
      this.selectedItem.updateRate = node.updateRate;
      this.selectedItem.hasTrigger = node.hasTrigger;
      this.selectedItem.nameAoi = node.nameAoi;
      this.selectedItem.lInfoAtt = node.lInfoAtt;
      this.selectedItem.isAoi = node.isAoi;
      this.selectedItem.isInjected = node.isInjected;
      this.selectedItem.sParentTagName = node.sParentTagName;
      this.selectedItem.sProgramParent = node.sProgramParent;
      this.selectedItem.rung = node.rung;
      this.selectedItem.updateRadio = node.updateRadio;
      this.selectedItem.Del = node.Del;
      this.selectedItem.EU = node.EU;
      this.selectedItem.hasBuffer = node.hasBuffer;
      this.selectedItem.hasChange = node.hasChange;

    }
    this.treeModelPost = this.treeModel;
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
    this.service.VerifyLogixInfoServer(foundIndex).subscribe(data => {
      if (data === true) {
        body['IsCodeInjectionNeeded'] = false;
        body['Program'] = null;
        body['Routine'] = null;
        body['Rung'] = null;
        this.connectingToChosenVersion(body, item, bodyTransfer);
        this.disableBtnOfMenu = false;
      } else if (data === false) {
        // show message
        this.manageMessageDialog([], false, false, 'Could not detect LogixInfoServer Program', true);
        this.disableBtnOfMenu = true;
      } else {
        this.onLoading = false;
        this.manageOfContent(false, false, false);
        this.manageMessageDialog([], false, true, 'You should set the language first!', false);
        this.disableBtnOfMenu = true;
        this.onDisableBtn = true;
      }
    }, err => {
      this.disableBtnOfMenu = true;
    });
  }
  connectingToChosenVersion(body, item, bodyTransfer) {
    this.service.connectToController(body).subscribe(data => {
      this.onLoading = false;
      console.log(data);
      if (data['Status'] != this.service.controllerMode.rsModeOffline) {
        this.onHideAoi = true;
      }
      this.checkStatus = data;
      if (data['Tree']) {
        this.successConnect(data['Tree'], bodyTransfer, item);
        this.disableBtnOfMenu = false;
      } else {
        this.service.SubjectLoadTree.next(data['Tree']);
        this.errorConnect();
        this.disableBtnOfMenu = true;
        if (item.Version) {
          this.manageMessageDialog([], false, true, 'Can\'t connect to controller...', false);
        } else {
          this.manageMessageDialog([], false, false, '', false);

        }
      }
      if(data['Status'] != this.service.controllerMode.rsModeOffline && data['IsOldVersion']) {
        this.manageMessageDialog([], false, true, 'Changes in this version is not allowed!', false);
        this.isChangesAllowed = false;
      } else {
        this.isChangesAllowed = true;
      }
      this.getProgram();
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
  onChangesNotAllowed() {
    this.manageMessageDialog([], false, true, 'Changes in this version is not allowed!', false);
  }
  manageMessageDialog(list, showInfoList, showInfoMessage, msg, showVerifyMessage) {
    this.onShowInfoMsg = {
      list: list,
      showInfoList: showInfoList,
      showInfoMessage: showInfoMessage,
      message: msg,
      showVerifyMessage: showVerifyMessage
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
    body['IsCodeInjectionNeeded'] = e.verify;
    body['Program'] = e.Program;
    body['Routine'] = e.Routine;
    body['Rung'] = e.Rung;
    if (e.verify) {
    this.connectingToChosenVersion(body, this.chosenVersion, bodyTransfer);
    } else {
      this.connectingToChosenVersion(body, this.chosenVersion, bodyTransfer);
    }
  }
  showNewMsg(e) {
    console.log(e);
    if (e) {
      this.manageMessageDialog([], false, true, 'Controller should be offline!', false);
    }
  }
  onReconnecting(e) {
    console.log(e);
    if (e) {
      this.getActiveControllerAndCheck();
    }
  }
  onShowAOI(e) {
    console.log(e)
    this.nameAoi = e.aoi;

    this.service.loadAOI(e.aoi).subscribe(value => {
      if (value) {
        const body = e;
        body['resAoi'] = value;
        this.showAOITab = body;
        this.manageOfContent(false, false, true);
        this.responseAoi = value;
      } else {
        e.emit = false;
        this.showAOITab = e;
        console.log(this.showAOITab);
        this.service.sendNotification(`Can\'t load AOI: ${e.aoi}`, 'fail');
        this.manageOfContent(true, false, false);
      }
    },
      error => {
        this.service.sendNotification(`Can\'t load AOI: ${e.aoi}`, 'fail');
        e.emit = false;
        this.showAOITab = e;
      });
  }
  getPath(e) {
    this.pathSelectedItem = undefined;
    this.pathSelectedItem = Object.assign({}, {path:e});
  }
  getProgram() {
    this.service.getPrograms().subscribe(programs => {
      this.programsAndRoutines = undefined;
      this.programsAndRoutines = Object.assign({}, {programs: programs});
    }, 
    err => {
      this.service.sendNotification('Cant load Programs!', 'fail')
})
  }
}
