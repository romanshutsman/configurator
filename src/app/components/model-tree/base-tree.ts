import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { TreeComponent, RaUiNestedTreeControl, ITreeNodeState, ITreeNode, ITreeConfig } from '@ra-web-tech-ui-toolkit-navigation';
import { SharedService } from './../../providers/shared.service';
import { Nullable } from '@ra-web-tech-ui-toolkit-common-utils';
import { NodeTree } from './../../providers/node.interface';
export class BaseTree {

  selectedNode: Nullable<ITreeNode>;
  treeControlRa: RaUiNestedTreeControl;
  config: ITreeConfig;
  treeModel: NodeTree[];
  treeExtension = [
    {
      iconClass: 'ra-icon ra-icon-home',
      condition: (node: ITreeNode): boolean => {
        return node.ID === 0;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-folder',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 0 && node.ID !== 0;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-gauge',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-network-resources',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 2 && node.SubType === 2;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-data-type',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 2 && node.SubType === 0 || node.Type === 2 && node.SubType === 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-text-editor',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 3;
      }
    }
  ];
  nodeTree;
  showContext: boolean;
  oldUnknowNode: NodeTree;
  nameAOI;
  arrayOfRadioBtns = [
    'Parent',
    'Rate',
    'Nothing'
  ];

  @Output() itemSelected = new EventEmitter();
  @Output() actionContextMenuChanged = new EventEmitter();
  @Output() transferTree = new EventEmitter();
  @Output() transferTreePost = new EventEmitter();

  constructor(public service: SharedService) {
    // let stringifyData = JSON.stringify(this.service.dataTREE);
    // stringifyData = stringifyData.replace(/nameInModel/g, 'label');
    // stringifyData = stringifyData.replace(/lChildrens/g, 'children');
    // const object = JSON.parse(stringifyData);
    // const data = [];
    // data.push(object);
    // this.treeModel = data;
    // console.log(this.treeModel);
  }
  onTreeInitialized(treeControl: RaUiNestedTreeControl) {
    this.treeControlRa = treeControl;
    this.treeControlRa.runForEachChild(this.treeModel, e => {
      this.loadUpdate(e);
      e.label = e.label + ' ' + this.addInfoNode(e);
    })
    this.treeControlRa.refreshUi.emit();

  }
  addInfoNode(node) {
    let arrayOfAttr = [];
    if(node.updateRadio=='Parent') {
      arrayOfAttr.push('P');
      if(node.isLogIn)  {
        arrayOfAttr = [];
      }
      if(node.hasTrigger) {
        if(node.isLogIn) {
          arrayOfAttr.push('P');
        }
        arrayOfAttr.push('T');
      }
      if(node.hasChange) arrayOfAttr.push('Ch');
    }

    if(node.updateRadio=='Rate') {
      let tempStr = node.updateRate + 'sec';
      arrayOfAttr.push(tempStr);
      if(node.hasTrigger) arrayOfAttr.push('T');
      if(node.hasChange) arrayOfAttr.push('Ch');
      if(!node.isLogIn) arrayOfAttr.push('NL');
    }

    if(node.updateRadio=='Nothing') {
      if(node.hasTrigger) arrayOfAttr.push('N');
      let tempStr = node.updateRate + ' sec';
      arrayOfAttr.push(tempStr);
      if(node.hasTrigger) arrayOfAttr.push('T');
      if(node.hasChange) arrayOfAttr.push('Ch');
      if(!node.isLogIn) arrayOfAttr.push('NL');
    }
    const stringOfAttr = arrayOfAttr.join(' + ');
    if(arrayOfAttr.length>0) {
      let finishedInfoString = '';
      const arrayWithParathethis = ['(', stringOfAttr, ')']
      finishedInfoString = arrayWithParathethis.join('');
      return finishedInfoString;
    }
    return '';

  }
  loadUpdate(node) {
    if (node.updateRate > 0) {
      if (node.hasTrigger) {
        node.updateRadio = this.arrayOfRadioBtns[1];
      } else {
        node.updateRadio = this.arrayOfRadioBtns[1];
      }
    } else if (node.updateRate == 0) {
      if (node.hasTrigger) {
        node.updateRadio = this.arrayOfRadioBtns[0];
      } else {
        node.updateRadio = this.arrayOfRadioBtns[0];
      }
    } else {
      node.updateRadio = this.arrayOfRadioBtns[2];
    }
  }

  cloneNode(item) {
    return {
      label: item.label,
      labelEdit: item.label,
      ParentID: item.ParentID,
      ID: item.ID,
      Type: item.Type,
      SubType: item.SubType,
      EU: item.EU,
      Min: item.Min,
      Max: item.Max,
      Mul: item.Mul,
      Exp: item.Exp,
      Program: item.Program,
      TagName: item.TagName,
      UID: item.UID,
      iStartD: item.iStartD,
      hasTrigger: item.hasTrigger,
      updateRate: item.updateRate,
      isMulp: item.isMulp,
      InternalIndex: item.InternalIndex,
      children: item.children,
      rung: item.rung,
      routine: item.routine,
      sProgramParent: item.sProgramParent,
      sParentTagName: item.TagName,
      updateRadio: item.updateRadio,
      isAoi: item.isAoi,
      nameAoi: item.nameAoi,
      lInfoAtt: item.lInfoAtt,
      isInjected: item.isInjected,
      hasChange: item.hasChange,
      hasBuffer: item.hasBuffer,
      isLogIn: item.isLogIn,
      Del: item.Del
    };
  }
  onDblClick(comp) {
    if (this.selectedNode.Type === 0) {
      this.sendActionAndType('edit', 'node', comp);
    } else if (this.selectedNode.Type === 1) {
      this.sendActionAndType('edit', 'real', comp);
    } else if (this.selectedNode.Type === 2) {
      this.sendActionAndType('edit', 'state', comp);
    } else if (this.selectedNode.Type === 2) {
      this.sendActionAndType('edit', 'dint', comp);
    } else if (this.selectedNode.Type === 3) {
      this.sendActionAndType('edit', 'string', comp);
    }
  }
  sendActionAndType(action, type, component) {
    this.service.SubjectControlTab.next('show_form');
    this.actionContextMenuChanged.emit({
      'action': action,
      'type': type,
      'nodeTree': this.nodeTree,
      'aoi': this.nameAOI,
      'component': component
    });
  }

  fixTreeLabels(tree): any{
    let stringifyData = tree;
    stringifyData = stringifyData.replace(/nameInModel/g, 'label');
    stringifyData = stringifyData.replace(/lChildrens/g, 'children');
    const object = JSON.parse(stringifyData);
    const data = [];
    data.push(object);
    return data;
  }

  parseTreeNode(tree) {
    let data = this.fixTreeLabels(tree);
    this.treeModel = data;
    this.transferTree.emit(this.treeModel);
    setTimeout(() => {
      this.transferTree.emit(this.treeModel);
    }, 0);
  }
  onAddNewNode(body) {
    const allNode = [];
    this.treeControlRa.runForEachChild(this.treeModel, e => allNode.push(e))
    body.ID = allNode.length + 1;

    this.selectedNode && this.treeControlRa.addChildren(this.selectedNode, [body]);
    this.transferTreePost.emit(this.treeModel);
  }
}
