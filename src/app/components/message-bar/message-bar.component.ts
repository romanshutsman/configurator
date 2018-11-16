import { SharedService } from './../../providers/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {
  statusBar: any;
  total: any;
  styleBar = 'success';

  constructor(private service: SharedService) {
    this.service.SubjectNotifications.subscribe((value) => {
      const point = value['total'];
      console.log(point)
      if (value) {
        this.showMessage(value['msg'], value['type'], point);
      }
    });
  }

  ngOnInit() {
  }
  showMessage(msg, type, total) {
    this.statusBar = msg;
    this.styleBar = type;
    if (msg === 'Collecting data') {
      this.total = 0;
    }
    if (total) {
      this.total = total;
      this.statusBar = `Collecting data, Recorded: ${total} `;
    }
    if (msg === 'Data saved!') {
      this.statusBar = `Data saved! Recorded: ${this.total} `;
    }
  }
}