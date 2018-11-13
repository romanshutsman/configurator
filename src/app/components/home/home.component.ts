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
  constructor(private service: SharedService) {
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
