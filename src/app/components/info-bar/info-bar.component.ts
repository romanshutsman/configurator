import { NodeTree } from './../../providers/node.interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {
  node: NodeTree;
  statusController = false;
  name: string;
  version: string;
  @Input() set SelectedNode(value) {
    if(value) {
      this.node = value;
    }
  }
  @Input() set status(value) {
    if(value) {
      this.name = value['project']['Name'];
      this.version = value['project']['Version'];
      this.statusController = value.status;
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
