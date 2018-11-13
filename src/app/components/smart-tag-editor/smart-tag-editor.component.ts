import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { NgForm, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SharedService } from '../../providers/shared.service';
import { NodeTree } from '../../providers/node.interface';
import { filter } from 'rxjs/operators';

// actionContextMenuChanged
// SubjectContextMenu
@Component({
  selector: 'app-smart-tag-editor',
  templateUrl: './smart-tag-editor.component.html',
  styleUrls: ['./smart-tag-editor.component.scss'],

})
export class SmartTagEditorComponent implements OnInit {

  @ViewChild('nodeForm') public nodeFrm: NgForm;
  @ViewChild('activeInput1') activeInput1: ElementRef;
  @ViewChild('activeInput2') activeInput2: ElementRef;

  pathNode: string;
  found: any;
  tree: NodeTree[];
  node: NodeTree;
  detailsOfNode: any;
  actionOnContextMenu: string;
  cloneSelectedNode: NodeTree;
  nodeiD: number;
  onEditOrAdd = false;
  nodeType: string;

  @Input() set SelectedSmartTag(value: NodeTree) {
    console.log(value);
    if (value) {
      this.initSelectedTag(value);
      this.cloneSelectedNode = this.cloneNode(value);
      this.nodeiD = this.cloneSelectedNode.iD;
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
      this.actionOnContextMenu = value;
      if (value.action === this.service.action.add) {
        if (value.type === 'node') {
          this.onEditOrAdd = true;
          this.nodeType = value.type;
        } else {
          this.onEditOrAdd = false;
          this.nodeType = value.type;
        }
      } else if (value.action === this.service.action.edit) {
        if (value.type === 'node') {
          this.onEditOrAdd = true;
          this.nodeType = value.type;
        } else {
          this.onEditOrAdd = false;
          this.nodeType = value.type;
        }
      } 
    }
  }
  @Input() set modifiedNode(value) {
    if (value) {
      if (value['action'] === 'edited') {
        this.node = this.cloneNode(value['body']);
      }
    }
  }

  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  

  cloneNode(item: NodeTree) {
    return {
      label: item.label,
      iParent: item.iParent,
      iD: item.iD,
      iType: item.iType,
      iSubType: item.iSubType,
      iFunction: item.iFunction,
      sEU: item.sEU,
      dMin: item.dMin,
      dMax: item.dMax,
      dMul: item.dMul,
      sExp: item.sExp,
      sProgram: item.sProgram,
      TagName: item.TagName,
      UID: item.UID,
      iStartD: item.iStartD,
      bHasTrigger: item.bHasTrigger,
      updateRate: item.updateRate,
      isMulp: item.isMulp,
      InternalIndex: item.InternalIndex,
      children: item.children,
      oTreeNode: item.oTreeNode,
      rung: item.rung,
      routine: item.routine,
      sProgramParent: item.sProgramParent,
      sParentTagName: item.TagName,
      updateRadio: item.updateRadio
    };
  }
  initSelectedTag(value) {
    this.node = this.cloneNode(value);
    this.pathNode = '';
    this.detailsOfNode = Array.of(this.node);
    this.searchAbsolutePath(this.detailsOfNode['0']);
  }
  searchAbsolutePath(node: NodeTree) {
    this.writePath(node.label);
    if (node.iParent === 0) return;
    this.found = undefined;
    const parent = this.findTreeElement(this.tree, node.iParent);
    if (parent) {
      this.searchAbsolutePath(parent);
    }

  }
  writePath(path) {
    this.pathNode = path + '/' + this.pathNode;
  }
  findTreeElement(nodeList: NodeTree[], id) {
    nodeList.forEach(item => {
      if (id == item.iD) {
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

}
