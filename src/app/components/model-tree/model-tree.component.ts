import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, ViewChildren, ElementRef } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Nullable } from '@ra-web-tech-ui-toolkit-common-utils';
import { SharedService } from './../../providers/shared.service';
import { NodeTree } from './../../providers/node.interface';
import { NgForm } from '@angular/forms';
import { BaseTree } from './base-tree';
import { ITreeNode, ITreeNodeState } from '@ra-web-tech-ui-toolkit-navigation';

@Component({
  selector: 'app-model-tree',
  templateUrl: './model-tree.component.html',
  styleUrls: ['./model-tree.component.scss']
})
export class ModelTreeComponent extends BaseTree implements OnInit {
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;


  detailsOfNode: any;
  ParentIDOfNodes = [];
  found: any;

  programsAndRoutines: any;
  onShowInfoMsg: any;

  newChangedNode: NodeTree;

  listOfAOI = [];
  @Output() showAOIMsg = new EventEmitter();
  @Output() showAOI = new EventEmitter();
  offsetTopEdit: any;
  offsetTopTooltip: any;
  offsetLeftTooltip: any;
  aoiName: any;
  @Input() set dataForm(value) {
    if (value) {
      if (value.component == 'model') {
        if (value.action === 'added') {
          value.body.label = value.body.label.replace(/ *\([^)]*\) */g, '');
          value.body.label = value.body.label + ' ' + this.addInfoNode(value.body);
          this.onAddNewNode(value.body)
        } else if (value.action === 'edited') {
          this.selectedNode.label = this.selectedNode.label.replace(/ *\([^)]*\) */g, '');
          this.selectedNode.label = this.selectedNode.label + ' ' + this.addInfoNode(this.selectedNode);
          this.selectedNode && this.treeControlRa.refreshUi.emit();
        }
      }
    }
  }
  checkedStatus = true;
  @Input() set CheckStatusOfController(value) {
    console.log(value)
    if (value) {
      if (value['Status'] != this.service.controllerMode.rsModeOffline) {
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
  constructor(public service: SharedService, private cdRef: ChangeDetectorRef) {
    super(service)
    this.service.SubjectLoadTree.subscribe((value) => {
      if (value) {
        this.service.sendNotification('Succesfully connected!', 'success');

        this.parseTreeNode(value);
      } else if (value === false) {
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
      }
    });


  }
  ngOnInit() {
    // should comment in production!!!!!!
    // setTimeout(() => {
    //   this.transferTree.emit(this.treeModel);
    // }, 0);
    this.treeExtension.push({
      iconClass: 'bgColorNode',
      condition: (node: ITreeNode): boolean => {
        return node.isInjected || node.isMulp;
      }
    })
    this.config = {
      shouldExpandOnCaret: true,
      isNodeIconEnabled: true,
      nodeExt: this.treeExtension,
      emptyTreeText: 'Tree is empty!'
    }
  }
  onTreeNodeSelected(event: ITreeNodeState) {
    if (event['value']) {
      const node = event['node'];
      this.nodeTree = node;
      this.oldUnknowNode = this.cloneNode(node);
      this.service.SubjectControlTab.next('hide_form_model');
      this.itemSelected.emit(node);
      const typeOfNode = node['Type'];
      if (typeOfNode === 0) {
        this.showContext = true;
        if (node['isInjected'] || node['isMulp']) {
          this.showContext = false;
        }
      } else {
        this.showContext = false;
      }
    }
    this.selectedNode = event.value ? event.node : undefined;
  }

  contextMenuType(type, component) {
    this.sendActionAndType('add', type, component);
  }

  setWidth() {
    if (this.nodeTree) {
      if (this.nodeTree.InternalIndex == 32) {
        return '80%'
      } else {
        return '100%'
      }
    }
  }
  getInfo(e) {
    this.offsetTopEdit = e.target.offsetTop + 'px';

  }
  changeParentID(form: NgForm) {
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
    this.writeFoundID(node.ParentID);
    if (node.ParentID < 0) return;
    this.found = undefined;
    // const parent = this.findTreeNode(this.treeModel, node.ParentID);
    this.treeModel.forEach(item => {
      if (item.ParentID) {
        this.writeFoundID(item.ParentID);
      } else {
        if (item.children.length) {
          item.children.forEach(elem => {
            if (elem.ParentID) {
              this.writeFoundID(item.ParentID);
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
  //     if (item.ParentID) {
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


  onHover() {
    console.log(this.checkedStatus);
    if (!this.checkedStatus) {
      this.showAOIMsg.emit(true);
    }
  }
  editAoi(aoiName) {
    console.log(aoiName);
    this.showAOI.emit({ emit: true, aoi: aoiName, selectedNode: this.nodeTree });
  }

  prepareInsertAoi(e) {
    const body = {};
    body['id'] = this.nodeTree.ID;
    body['tagName'] = e.Name;
    body['program'] = e.Program;
    body['routine'] = e.Routine;
    body['rung'] = e.Rung;
    body['name'] = this.aoiName.name;

    if (e.Name && e.Program) {
      this.service.insertAOI(body).subscribe(i => {
        let tree = this.fixTreeLabels(JSON.stringify(i));
        this.onAddNewNode(tree[0]);
      })
    }
  }

  insertAoi(item) {
    console.log(item)
    this.aoiName = Object.assign({ name: item });
    console.log(this.service);
    if (this.service.programsAndRoutines)
      this.programsAndRoutines = Object.assign({}, { programs: this.service.programsAndRoutines.programs });
    console.log(this.programsAndRoutines);

    this.manageMessageDialog([], false, false, '', true);

    console.log(item)

  }

  showTooltip(e) {
    const classes = e.target.classList;
    for (let i = 0; i < classes.length; i++) {
      if (classes[i] == 'ra-icon-priority-medium') {
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
      if (classes[i] == 'ra-icon-priority-medium') {
        this.offsetTopTooltip = -2000 + 'px';
        this.offsetLeftTooltip = -2000 + 'px';
      }
    }
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


}
