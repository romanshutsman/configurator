import { Output, EventEmitter } from '@angular/core';
import { RaUiNestedTreeControl, ITreeNode, ITreeConfig } from '@ra-web-tech-ui-toolkit-navigation';
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
    },
    {
      iconClass: 'ra-icon ra-icon-add-examples',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 4;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-data-server',
      condition: (node: ITreeNode): boolean => {
        return node.Type === 5;
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
      e.updateRate = Math.abs(e.updateRate);
      this.loadUpdate(e);
      e.labelInfo = this.addInfoNode(e);
    })
    this.treeControlRa.refreshUi.emit();

  }
  addInfoNode(node) {
    let arrayOfAttr = [];
    if(node.updateRadio=='Parent') {
      arrayOfAttr.push('P');
      if(node.hasBuffer)  {
        arrayOfAttr = [];
      }
      if(node.hasTrigger) {
        if(node.hasBuffer) {
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
      if(!node.hasBuffer) arrayOfAttr.push('NL');
    }

    if(node.updateRadio=='Nothing') {
      if(node.hasTrigger) arrayOfAttr.push('N');
      let tempStr = node.updateRate + ' sec';
      arrayOfAttr.push(tempStr);
      if(node.hasTrigger) arrayOfAttr.push('T');
      if(node.hasChange) arrayOfAttr.push('Ch');
      if(!node.hasBuffer) arrayOfAttr.push('NL');
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
    } else if (this.selectedNode.Type === 4) {
      this.sendActionAndType('edit', 'real-write', comp);
    } else if (this.selectedNode.Type === 5) {
      this.sendActionAndType('edit', 'dint-write', comp);
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
