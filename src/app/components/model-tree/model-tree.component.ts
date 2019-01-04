import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Nullable } from '@ra-web-tech-ui-toolkit/common-utils';
import { TreeComponent, RaUiNestedTreeControl, ITreeNodeState, ITreeNode, ITreeConfig } from '@ra-web-tech-ui-toolkit/navigation';
import { SharedService } from './../../providers/shared.service';
import { NodeTree } from './../../providers/node.interface';
import { copyFileSync } from 'fs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-model-tree',
  templateUrl: './model-tree.component.html',
  styleUrls: ['./model-tree.component.scss']
})
export class ModelTreeComponent implements OnInit {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  selectedNode: Nullable<ITreeNode>;
  treeControlRa: RaUiNestedTreeControl;
  showContext: boolean;
  treeModel: NodeTree[];
  detailsOfNode: any;
  ParentIDOfNodes = [];
  found: any;
  nodeTree;
  config: ITreeConfig;
  oldUnknowNode: NodeTree;
  newChangedNode: NodeTree;
  treeExtension = [
    {
      iconClass: 'ra-icon ra-icon-home',
      condition: (node: ITreeNode): boolean => {
        return node.iD === 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-folder',
      condition: (node: ITreeNode): boolean => {
        return node.iType === 0 && node.iD !== 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-gauge',
      condition: (node: ITreeNode): boolean => {
        return node.iType === 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-network-resources',
      condition: (node: ITreeNode): boolean => {
        return node.iType === 2 && node.iSubType === 2;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-data-type',
      condition: (node: ITreeNode): boolean => {
        return node.iType === 2 && node.iSubType === 0 || node.iType === 2 && node.iSubType === 1;
      }
    },
    {
      iconClass: 'ra-icon ra-icon-text-editor',
      condition: (node: ITreeNode): boolean => {
        return node.iType === 3;
      }
    }
    // ,
    // {
    //   iconClass: 'ra-icon ra-icon-priority-medium',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iFunction !== 0;
    //     // return true;
    //   }
    // }
  ];
  listOfAOI = [];
  @Output() itemSelected = new EventEmitter();
  @Output() transferTree = new EventEmitter();
  @Output() showAOIMsg = new EventEmitter();
  @Output() showAOI = new EventEmitter();
  @Output() actionContextMenuChanged = new EventEmitter();
  offsetTopEdit: any;
  offsetTopTooltip: any;
  offsetLeftTooltip: any;
  @Input() set dataForm(value) {
    if (value) {
      if (value.action === 'added') {
        this.onAddNewNode(value.body)
      } else if (value.action === 'edited') {
        this.selectedNode && this.treeControlRa.refreshUi;
      }
    }
  }
  checkedStatus = true;
  @Input() set  CheckStatusOfController(value) {
    console.log(value)
    if(value) {
      if(value['Status'] != 6) {
        this.checkedStatus = false;
      } else {
        this.checkedStatus = true;
      }
      this.listOfAOI = value['Aois'];
    }
  };
  visibleBlock = false;
  @Input() set onReconnectLoading(value) {
    this.visibleBlock = value;
  }
  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
    this.service.SubjectLoadTree.subscribe((value) => {
      if (value) {
        this.service.sendNotification('Succesfully connected!', 'success');

        this.parseTreeNode(value);
      } else if (value === false) {
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
      }
    });

    // let stringifyData = JSON.stringify(this.service.dataTREE);
    // stringifyData = stringifyData.replace(/nameInModel/g, 'label');
    // stringifyData = stringifyData.replace(/lChildrens/g, 'children');
    // const object = JSON.parse(stringifyData);
    // const data = [];
    // data.push(object);
    // this.treeModel = data;
    // console.log(this.treeModel);
    // console.log(data);

  }
  ngOnInit() {
    // should comment in production!!!!!!
    // setTimeout(() => {
    //   this.transferTree.emit(this.treeModel);
    // }, 0);
    this.config = {
      shouldExpandOnCaret: true,
      isNodeIconEnabled: true,
      nodeExt: this.treeExtension,
      emptyTreeText: 'Tree is empty!'
    }
  }
  parseTreeNode(tree) {
    let stringifyData = tree;
    stringifyData = stringifyData.replace(/nameInModel/g, 'label');
    stringifyData = stringifyData.replace(/lChildrens/g, 'children');
    const object = JSON.parse(stringifyData);
    const data = [];
    data.push(object);
    this.treeModel = data;
    this.transferTree.emit(this.treeModel);
    setTimeout(() => {
      this.transferTree.emit(this.treeModel);
    }, 0);
  }
  onTreeInitialized(treeControl: RaUiNestedTreeControl) {
    this.treeControlRa = treeControl;
  }

  onTreeNodeSelected(event: ITreeNodeState) {
    if (event['value']) {
      const node = event['node'];
      this.nodeTree = node;
      this.oldUnknowNode = this.cloneNode(node);
      this.service.SubjectControlTab.next('hide_form');
      this.itemSelected.emit(node);
      const typeOfNode = node['iType'];
      if (typeOfNode === 0) {
        this.showContext = true;
      } else {
        this.showContext = false;
      }

    }
    this.selectedNode = event.value ? event.node : undefined;
    console.log(this.selectedNode);
  }

  onAddNewNode(body) {
    this.selectedNode && this.treeControlRa.addChildren(this.selectedNode, [body]);
  }
  contextMenuType(type) {
    this.sendActionAndType('add', type);
  }

  onDblClick() {
    if (this.selectedNode.iType === 0) {
      this.sendActionAndType('edit', 'node');
    } else if (this.selectedNode.iType === 1) {
      this.sendActionAndType('edit', 'real');
    } else if (this.selectedNode.iType === 2) {
      this.sendActionAndType('edit', 'state');
    } else if (this.selectedNode.iType === 2) {
      this.sendActionAndType('edit', 'dint');
    } else if (this.selectedNode.iType === 3) {
      this.sendActionAndType('edit', 'string');
    }
  }
  sendActionAndType(action, type) {
    this.service.SubjectControlTab.next('show_form');
    this.actionContextMenuChanged.emit({
      'action': action,
      'type': type,
      'nodeTree': this.nodeTree
    });
  }
  setWidth() {
    if(this.nodeTree) {
      if(this.nodeTree.InternalIndex == 32) {
        return '80%'
      } else {
        return '100%'
      }
    }
  }
  getInfo(e) {
    this.offsetTopEdit = e.target.offsetTop + 'px';
    
  }
  changeParentID (form: NgForm) {
    console.log(form.controls.parentID.value);
    console.log(this.oldUnknowNode);
    // this. = form.controls.parentID.value;
    // this.onAddNewNode(this.oldUnknowNode);

    // this.selectedNode && this.treeControlRa.addChildren(this.selectedNode, [this.selectedNode]);
    console.log(this.treeModel[0]);
    const node = this.treeModel[0];
    // this.searchAllParentID(node);
  }

  searchAllParentID(node) {
    this.writeFoundID(node.iParent);
    if (node.iParent < 0 ) return;
    this.found = undefined;
    // const parent = this.findTreeNode(this.treeModel, node.iParent);
    this.treeModel.forEach( item => {
      if(item.iParent) {
        this.writeFoundID(item.iParent);
      } else {
        if (item.children.length) {
          item.children.forEach( elem => {
            if(elem.iParent) {
              this.writeFoundID(item.iParent);
            } else {
              this.searchAllParentID(elem);
            }
          })
        }
      }
    })
  }
  writeFoundID(id) {
    this.ParentIDOfNodes.push(id);
  }
  // findTreeNode(nodeList: NodeTree[], id) {
  //   nodeList.forEach(item => {
  //     if (item.iParent) {
  //       this.found = item;
  //       return;
  //     } else {
  //       if (item.children.length) {
  //         this.findTreeNode(item.children, id);
  //       }
  //     }
  //   });
  //   if (this.found) return this.found;
  // }


  cloneNode(item) {
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
  onHover() {
    console.log(this.checkedStatus);
    if(!this.checkedStatus) {
      this.showAOIMsg.emit(true);
    }
  }
  contextMenuAOI(e) {
    this.showAOI.emit({emit: true, aoi: e, selectedNode: this.nodeTree});
  }
  showTooltip(e) {
    const classes = e.target.classList;
    for (let i = 0; i < classes.length; i++) {
      if(classes[i] == 'ra-icon-priority-medium') {
        const offsetTop = e.target.offsetTop - 20;
        const offsetLeft = e.target.offsetLeft - 50;
        this.offsetTopTooltip = offsetTop + 'px';
        this.offsetLeftTooltip = offsetLeft + 'px';
      }
    }
  }
  hideTooltip(e) {
    const classes = e.target.classList;
    for (let i = 0; i < classes.length; i++) {
      if(classes[i] == 'ra-icon-priority-medium') {
        this.offsetTopTooltip = -2000 + 'px';
        this.offsetLeftTooltip = -2000 + 'px';
      }
    }
  }
}
