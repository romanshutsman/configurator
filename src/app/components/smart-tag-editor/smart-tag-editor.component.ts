import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedService } from '../../providers/shared.service';
import { NodeTree } from '../../providers/node.interface';
import { BaseSmartTag } from './base-smart-tag';

@Component({
  selector: 'app-smart-tag-editor',
  templateUrl: './smart-tag-editor.component.html',
  styleUrls: ['./smart-tag-editor.component.scss'],

})
export class SmartTagEditorComponent extends BaseSmartTag implements OnInit {

  @ViewChild('nodeForm') public nodeFrm: NgForm;

  pathNode: string;
  found: any;
  tree: NodeTree[];
  node: NodeTree;
  detailsOfNode: any;
  actionOnContextMenu: string;
  cloneSelectedNode: NodeTree;
  nodeiD: number;
  nodeType: string;
  parentOfSelectedNode;
  countOfCall = 0;
  transferPrograms;
  

  @Input() set SelectedSmartTag(value: NodeTree) {
    console.log(value);
    if (value) {
      this.initSelectedTag(value);
      this.cloneSelectedNode = this.service.cloneNode(value);
      this.nodeiD = this.cloneSelectedNode.ID;
    }
  }

  @Input() set Tree(value) {
    console.log(value);
    if (value) {
      this.tree = value;
    }
  }
  @Input() set actionMenu(value) {
    console.log(value);
    if (value) {
      console.log(value);
      this.actionOnContextMenu = value;
      this.pathNode = '';
      this.countOfCall = 0;
      this.parentOfSelectedNode = undefined;
      console.log(this.detailsOfNode['0']);
      this.searchAbsolutePath(this.detailsOfNode['0']);
      this.nodeType = value.type;
    }
  }
  @Input() set modifiedNode(value) {
    if (value) {
      if (value['action'] === 'edited') {
        this.node = this.service.cloneNode(value['body']);
      }
    }
  }

  @Input() set getAllPrograms(value) {
    if(value) {
      this.transferPrograms = undefined;
      this.transferPrograms = Object.assign({}, value)
    }
  }

  @Output() pathSelectedNode = new EventEmitter();

  constructor(public service: SharedService, private cdRef: ChangeDetectorRef) {
    super(service);
  }

  ngOnInit() {
    
  }

  initSelectedTag(value) {
    this.node = this.service.cloneNode(value);
    this.pathNode = '';
    this.detailsOfNode = Array.of(this.node);
    this.countOfCall = 0;
    this.parentOfSelectedNode = undefined;
  }
  searchAbsolutePath(node: NodeTree) {
    this.writePath(node.label);
    this.getParent(node);

    if (node.ParentID === 0) return;
    this.found = undefined;
    const parent = this.findTreeElement(this.tree, node.ParentID);
    if (parent) {
      this.searchAbsolutePath(parent);
    }

  }
  writePath(path) {
    this.pathNode = path + '/' + this.pathNode;
    console.log(this.pathNode);
    this.pathSelectedNode.emit(this.pathNode);
  }
  findTreeElement(nodeList: NodeTree[], id) {
    nodeList.forEach(item => {
      if (id == item.ID) {
        this.found = item;
        return;
      } else {
        if (item.children.length) {
          this.findTreeElement(item.children, id);
        }
      }
    });
    if (this.found) return this.found;
  }
  getParent(node) {
    if (this.actionOnContextMenu['action'] === this.service.action.edit) {
      console.log(this.parentOfSelectedNode);
      if (this.countOfCall === 1) {
        this.parentOfSelectedNode = {parent:node, selectedItem: this.cloneSelectedNode};
      }
    } else {
      console.log(this.parentOfSelectedNode);
      this.parentOfSelectedNode = {parent:undefined, selectedItem: this.cloneSelectedNode};
    }
    this.countOfCall++;
  }

}
