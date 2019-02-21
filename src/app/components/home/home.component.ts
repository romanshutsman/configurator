import { NodeTree } from './../../providers/node.interface';
import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../providers/shared.service';
import { ApiResponse, MessageType, ApiMessage } from 'src/app/providers/api-response-model';
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
  onHideAoi = false;
  onDisableBtn = false;
  showAOITab = false;
  responseAoi;
  nameAoi: any;
  pathSelectedItem;
  programsAndRoutines;
  isChangesAllowed = true;
  elementId: number;

  constructor(private service: SharedService) {
    this.getActiveControllerAndCheck();
  }
  getTree(e) {
    this.treeModel = e;
    this.manageOfBtns(false, false, false);
  }

  getTreeOnPost(e) {
    if (this.treeModelPost && this.treeModelPost[0].isAoi) {
      this.treeModelPost = Object.assign({}, e);
    } else {
      this.treeModelPost = e;
    }
  }

  getNode(e) {
    this.selectedItem = e;
    this.pathSelectedItem = Object.assign({}, { path: undefined });
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
    if (e.component == 'model') {
      this.manageOfContent(true, false, false);
    } else {
      this.manageOfContent(false, false, true);
    }
    this.operationOnForm = e;
    this.bodyForm = e;
    this.manageOfBtns(false, false, false);
    if (e['action'] === 'edited') {
      const node = e['body'];
      this.selectedItem = Object.assign(this.selectedItem, node);
    }
    this.elementId = e['id'];
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
    this.onDisableBtn = false;
    this.service.getActiveControllers().subscribe((data: ApiResponse<Array<any>>) => {
      this.onLoading = false;
      this.listOfControllers = data.Result;

      this.manageMessageDialog(data.Result && data.Result.length > 1 ? data.Result : [], data.Message, false);

      if (!data.Result || data.Result.length === 0) {
        this.disableBtnOfMenu = true; return;
      }
      this.disableBtnOfMenu = false;
      if (data.Result.length === 1)
        this.checkVerification(data.Result[0]);
    },
      error => {
        this.onLoading = false;
        this.service.sendNotification(undefined);
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
    this.onLoading = true;
    this.chosenVersion = item;
    const bodyTransfer = {};
    const body = {};
    bodyTransfer['Name'] = item.Version;
    body['Version'] = item.Version;
    const foundIndex = this.listOfControllers.findIndex(i => i === item);
    this.service.VerifyLogixInfoServer(foundIndex).subscribe((data: ApiResponse<any>) => {
      if (data.Result) {
        body['IsCodeInjectionNeeded'] = false;
        body['Program'] = null;
        body['Routine'] = null;
        body['Rung'] = null;
        this.connectingToChosenVersion(body, item, bodyTransfer);
        this.disableBtnOfMenu = false;
      } else {
        let verifyMessage = true;
        if (data.Result === null){
          this.manageOfContent(false, false, false);
          this.onLoading = verifyMessage = false;
        }
        this.manageMessageDialog([], data.Message, verifyMessage);
        this.disableBtnOfMenu = true;
      } 
    }, err => {
      this.disableBtnOfMenu = true;
    });
  }

  connectingToChosenVersion(body, item, bodyTransfer) {
    this.service.connectToController(body).subscribe((data: ApiResponse<any>) => {
      this.onLoading = false;
      if (!data.Result || !data.Result['Tree']) {
        this.manageMessageDialog([], data.Message, false);
        this.disableBtnOfMenu = true;
        this.errorConnect();
        return;
      }
      this.disableBtnOfMenu = false;
      if (data.Result['Status'] != this.service.controllerMode.rsModeOffline) {
        this.onHideAoi = true;
      }
      this.checkStatus = data.Result;
      this.successConnect(data, bodyTransfer, item);
      this.manageMessageDialog([], data.Message, false);

      if (data.Result['Status'] != this.service.controllerMode.rsModeOffline && data.Result['IsOldVersion']) {
        this.isChangesAllowed = false;
      } else {
        this.isChangesAllowed = true;
      }
      this.getProgram();
    },
      error => {
        this.onLoading = false;
        this.disableBtnOfMenu = true;
        this.manageMessageDialog([], undefined, false);
        if (item.Version !== '') {
          this.errorConnect();
        }
      });
  }
  onChangesNotAllowed() {
    this.manageMessageDialog([], {
      Text: 'Changes in this version is not allowed!',
      Type: 'info',
      Color: null,
      BgColor: null,
      IsPopup: true
    }, false);
  }

  initForm() {
    this.getProgram();
  }

  messageReceived(message: ApiMessage) {
    this.manageMessageDialog([], message, false);
  }

  manageMessageDialog(list, msg: ApiMessage, showVerifyMessage) {
    if (!msg.IsPopup) {
      this.service.sendNotification(msg);
      return;
    }
    this.onShowInfoMsg = {
      list: list,
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
    this.connectingToChosenVersion(body, this.chosenVersion, bodyTransfer);
  }

  onReconnecting(e) {
    if (e) {
      this.getActiveControllerAndCheck();
    }
  }
  onShowAOI(e) {
    this.nameAoi = e.aoi;
    this.service.loadAOI(e.aoi).subscribe((value: ApiResponse<any>) => {
      if (value) {
        const body = e;
        body['resAoi'] = value.Result;
        this.showAOITab = body;
        this.manageOfContent(false, false, true);
        this.responseAoi = value.Result;
      } else {
        e.emit = false;
        this.showAOITab = e;
        this.service.sendNotification(value.Message);
        this.manageOfContent(true, false, false);
      }
    },
      error => {
        this.service.sendNotification(undefined);
        e.emit = false;
        this.showAOITab = e;
      });
  }
  getPath(e) {
    this.pathSelectedItem = undefined;
    this.pathSelectedItem = Object.assign({}, { path: e });
  }
  getProgram() {
    this.service.getPrograms().subscribe((data: ApiResponse<any>) => {

      if (!data.Result) {
        this.service.sendNotification(data.Message);
        return;
      }

      this.service.programsAndRoutines = Object.assign({}, { programs: data.Result });
      this.programsAndRoutines = this.service.programsAndRoutines;
    },
      err => {
        this.service.sendNotification(undefined);
      })
  }
}
