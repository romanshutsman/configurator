import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, ViewChildren, ElementRef } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Nullable } from '@ra-web-tech-ui-toolkit-common-utils';
import { SharedService } from './../../providers/shared.service';
import { NodeTree } from './../../providers/node.interface';
import { BaseTree } from './base-tree';
import { ITreeNode, ITreeNodeState } from '@ra-web-tech-ui-toolkit-navigation';
import { ApiResponse, ApiMessage } from 'src/app/providers/api-response-model';

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
  unKnownNodes: any;


  @Input() set unKnownElements(val) {
    this.unKnownNodes = this.fixTreeLabels(val);
    console.log(this.unKnownNodes);
  }

  @Input() set dataForm(value) {
    if (value) {
      if (value.action === 'added') {
        value.body.labelInfo = this.addInfoNode(value.body);
        this.onAddNewNode(value.body)
      } else if (value.action === 'edited' && value.component == 'model') {
        this.selectedNode.labelInfo = this.addInfoNode(this.selectedNode);
        this.selectedNode && this.treeControlRa.refreshUi.emit();
      }
    }
  }
  checkedStatus = true;
  @Input() set CheckStatusOfController(value) {
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
    //if loading clear treeModel
    if (value)
      this.treeModel = undefined;
    this.visibleBlock = value;
  }
  // unKnownNodes = [
  //   { label: 'R21', Type: 2, children: [] },
  //   { label: 'D22', Type: 3, children: [] },
  //   { label: 'D22', Type: 4, children: [] },
  //   { label: 'D22', Type: 5, children: [] },
  //   { label: 'D22', Type: 5, children: [] },
  //   { label: 'D22', Type: 2, children: [] },

  // ];
  listOfNode = [];
  unknownNodeSelected: Nullable<ITreeNode>;

  constructor(public service: SharedService, private cdRef: ChangeDetectorRef) {
    super(service)
    this.service.SubjectLoadTree.subscribe(value => {
      if (!value) {
        return;
      }
      if (value.Result && value.Result['Tree']) {
        this.parseTreeNode(value.Result['Tree']);
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
      this.oldUnknowNode = this.service.cloneNode(node);
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
  onTreeUnknownNodeSelected(event: ITreeNodeState) {
    this.unknownNodeSelected = event.value ? event.node : undefined;
  }

  contextMenuType(type, component) {
    this.sendActionAndType('add', type, component);
  }

  onHover() {
    if (!this.checkedStatus) {
      this.manageMessageDialog([], { Text: 'Controller should be offline!', Type: 'info', Color: null, BgColor: null, IsPopup: true }, false);
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
      this.service.insertAOI(body).subscribe((i: ApiResponse<any>) => {
        if (!i.Result) {
          this.manageMessageDialog([], i.Message, false);
          return;
        }
        let tree = this.fixTreeLabels(JSON.stringify(i));
        this.onAddNewNode(tree[0].children);
      })
    }
  }

  insertAoi(item) {
    console.log(item)
    this.aoiName = Object.assign({ name: item });
    if (this.service.programsAndRoutines)
      this.programsAndRoutines = Object.assign({}, { programs: this.service.programsAndRoutines.programs });

    this.manageMessageDialog([], { Text: '', Type: 'info', Color: null, BgColor: null, IsPopup: true }, true);
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

  addUnknownNode() {
    this.unknownNodeSelected.ParentID = this.selectedNode.ID;
    this.unknownNodeSelected.Routine = this.selectedNode.Routine;
    this.service.addNode(this.unknownNodeSelected).subscribe((value: ApiResponse<any>) => {
      this.manageMessageDialog(null, value.Message, false);

      if (!value.Result) return;
      this.onAddNewNode(this.unknownNodeSelected);
      this.unKnownNodes = this.unKnownNodes.filter(i => this.unknownNodeSelected != i);
      this.unknownNodeSelected && this.treeControlRa.refreshUi.emit();
    },
      err => {
        this.service.sendNotification(undefined);
      });
  }
}
