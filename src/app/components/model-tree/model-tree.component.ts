import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Nullable } from '@ra-web-tech-ui-toolkit/common-utils';
import { TreeComponent, RaUiNestedTreeControl, ITreeNodeState, ITreeNode, ITreeConfig } from '@ra-web-tech-ui-toolkit/navigation';
import { SharedService } from './../../providers/shared.service';
import { NodeTree } from './../../providers/node.interface';

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
  pathNode: string;
  found: any;
  nodeTree;
  config: ITreeConfig;
  treeExtension = [
    // {
    //   iconClass: 'ra-icon ra-icon-home',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iD === 1;
    //   }
    // },
    // {
    //   iconClass: 'ra-icon ra-icon-flag',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iType === 0 && node.iD !== 1;
    //   }
    // },
    // {
    //   iconClass: 'ra-icon ra-icon-image',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iType === 1;
    //   }
    // },
    // {
    //   iconClass: 'ra-icon ra-icon-scope',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iType === 2;
    //   }
    // },
    // {
    //   iconClass: 'ra-icon ra-icon-share',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iType === 3;
    //   }
    // },
    // {
    //   iconClass: 'ra-icon ra-icon-text-editor',
    //   condition: (node: ITreeNode): boolean => {
    //     return node.iType === 4;
    //   }
    // }
  ];
  @Output() itemSelected = new EventEmitter();
  @Output() transferTree = new EventEmitter();
  @Output() actionContextMenuChanged = new EventEmitter();
  @Input() set dataForm(value) {
    if (value) {
      console.log(value);
      if (value.action === 'added') {
        this.onAddNewNode(value.body)
      } else if (value.action === 'edited') {
        this.selectedNode && this.treeControlRa.refreshUi;
      }
    }
  }
  constructor(private service: SharedService, private cdRef: ChangeDetectorRef) {
    localStorage.setItem('item', '1654646565465');
    this.service.SubjectLoadTree.subscribe((value) => {
      console.log('SubjectLoadTree', value);
      if (value) {
        this.service.sendNotification('Succesfully connected!', 'success');

        this.parseTreeNode(value);
      } else if (value === false) {
        this.service.sendNotification('Can\'t connect to controller...', 'fail');
      }
    });

    let stringifyData = JSON.stringify(this.service.dataTREE);
    stringifyData = stringifyData.replace(/sName/g, 'label');
    stringifyData = stringifyData.replace(/lChildrens/g, 'children');
    const object = JSON.parse(stringifyData);
    const data = [];
    data.push(object);
    this.treeModel = data;
    console.log(this.treeModel);
    console.log(data);

  }

  ngOnInit() {
    // should comment in production!!!!!!
    setTimeout(() => {
      this.transferTree.emit(this.treeModel);
    }, 0);
    this.config = {
      shouldExpandOnCaret: true,
      isNodeIconEnabled: true,
      nodeExt: this.treeExtension
    }
  }
  parseTreeNode(tree) {
    let stringifyData = JSON.stringify(tree);
    stringifyData = stringifyData.replace(/sName/g, 'label');
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

}
