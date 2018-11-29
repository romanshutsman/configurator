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
  constructor(private service: SharedService) {
    console.log("home")
    this.connecting();
  }
  getTree(e) {
    console.log(e);
    this.treeModel = e;
    this.showBtnOnContent(false, false, false);
  }
  getNode(e) {
    this.selectedItem = e;
    this.showBtnOnContent(false, false, false);
  }
  actionMenu(e) {
    this.actionContextMenu = e;
    console.log(e);
    console.log(this.actionContextMenu);
    switch (e.action) {
      case this.service.action.add:
        this.showContent(false, true);
        this.showBtnOnContent(true, false, false);
        break;
      case this.service.action.edit:
        this.showContent(false, true);
        this.showBtnOnContent(false, true, true);
        break;
      default:
        this.showContent(true, false);
        this.showBtnOnContent(false, false, false);
        break;
    }
  }
  selectedContent(e) {
    console.log('SELECTED CONTENT', e)
    switch (e) {
      case 'model-tree':
        this.showContent(true, false);
        this.showBtnOnContent(false, false, false);
        break;
      case 'smart-tag-editor':
        if (this.actionContextMenu) {
          switch (this.actionContextMenu.action) {
            case this.service.action.add:
              this.showBtnOnContent(true, false, false);
              break;
            case this.service.action.edit:
              this.showBtnOnContent(false, true, true);
              break;
            default:
              this.showBtnOnContent(false, false, false);
              break;
          }
        }
        this.showContent(false, true);
        break;
      default:
        this.showContent(true, false);
        break;
    }
  }
  onClicked(e) {
    this.showContent(true, false);
    console.log(e);
    this.operationOnForm = e;
    this.bodyForm = e;
    this.showBtnOnContent(false, false, false);
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
      this.showContent(true, false);
    }
    this.statusOfController = e;
  }

  sendPostController = controller => this.chooseVersion(controller);

  connecting() {
    this.service.connectVersionsofControllers().subscribe((data: any) => {
      if (data.length === 0) {
        const body = { 'Version': '' };
        this.manageMessageDialog([], false, true, 'No active controllers!');
        this.chooseVersion(body);
      } else if (data.length === 1) {
        this.manageMessageDialog(data, false, false, '');
        this.chooseVersion(data[0]);
      } else if (data.length > 1) {
        this.manageMessageDialog(data, true, false, '');
      }
    },
      error => {
        const body = { 'Version': '' };
        this.manageMessageDialog([], false, true, 'Can\'t connect to controller...');
        this.chooseVersion(body);
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
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

  chooseVersion( item) {
    const body = {};
    body['Name'] = item.Version;
    this.service.chooseVersionsofControllers(item.Version).subscribe(data => {
      if (data) {
        this.successConnect(data, body, item);
        this.manageMessageDialog([], false, true, 'Succesfully connected');
      } else {
        this.service.SubjectLoadTree.next(data);
        this.errorConnect();
        if(item.Version) {
          this.manageMessageDialog([], false, true, 'Can\'t connect to controller...');
        } else {
          this.manageMessageDialog([], false, false, '');

        }
      }
    },
    error => {
      this.manageMessageDialog([], false, true, 'Can\'t connect to controller...');
      if (item.Version !== '') {
          this.errorConnect();
        }
      });
  }

  
  manageMessageDialog(list, show, showConnect, msg) {
    this.onConnect = {
      list: list,
      show: show,
      showConnect: showConnect,
      message: msg
    };
  }
  showContent(tree, form) {
    this.showTabTree = tree;
    this.showTabOperation = form;
  }
  showBtnOnContent(add, edit, nav) {
    this.showBtn = {
      'add': add,
      'edit': edit,
      'navigate': nav
    };
  }
}
