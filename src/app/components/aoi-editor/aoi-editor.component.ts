import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { BaseTree } from '../model-tree/base-tree';
import { SharedService } from 'src/app/providers/shared.service';
import { NodeTree } from 'src/app/providers/node.interface';
import { ITreeNodeState } from '@ra-web-tech-ui-toolkit/navigation';

@Component({
  selector: 'app-aoi-editor',
  templateUrl: './aoi-editor.component.html',
  styleUrls: ['./aoi-editor.component.scss']
})
export class AoiEditorComponent extends BaseTree implements OnInit {
  aoi;
  treeModel: NodeTree[];
  offsetTopEdit: any;

  @Input() set loadedAoi(value) {
    if(value) {
      this.aoi = value;
      this.parseTreeNode(value)
    }
  }
  @Input() set dataForm(value) {
    if (value) {
      if (value.action === 'added') {
        this.onAddNewNode(value.body)
      } else if (value.action === 'edited') {
        this.selectedNode && this.treeControlRa.refreshUi;
      }
    }
  }
  @Input() set onActiveAOI(value) {
    if(value) {
      this.nameAOI = value.aoi;
    }
  }
  @ViewChild(ContextMenuComponent) public basicMenu2: ContextMenuComponent;

  constructor(public service: SharedService) {
    super(service);


  }

  ngOnInit() {
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
    let stringifyData = JSON.stringify(tree);
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
  contextMenuType(type, component) {
    this.sendActionAndType('add', type, component);
  }
  onTreeNodeSelected(event: ITreeNodeState) {
    if (event['value']) {
      const node = event['node'];
      this.nodeTree = node;
      this.oldUnknowNode = this.cloneNode(node);
      this.service.SubjectControlTab.next('hide_form_aoi');
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

}
