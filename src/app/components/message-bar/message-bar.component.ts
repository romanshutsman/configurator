import { SharedService } from './../../providers/shared.service';
import { Component, OnInit } from '@angular/core';
import { ApiMessage } from 'src/app/providers/api-response-model';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {
  statusBar: any;
  total: any;
  styleBar = 'success';
  color: string = '#f1f441';

  timelineSuccess = {
    background: '#80C46E',
    color: 'white'
  }
  timelineError = {
    background: '#DCC1C1',
    color: '#862f2f'
  }
  timelineStarted = {
    background: 'lightgray',
    color: '#6d6d6d'
  }

  style = {
    background: '',
    color: 'white'
  }

  constructor(private service: SharedService) {
    this.service.SubjectNotifications.subscribe((value: ApiMessage) => {

      if (value && value.Text) {
        this.showMessage(value);
      }

      //api offline
      if (value == undefined) {
        this.style = this.timelineError;
        this.statusBar = 'Something went wrong. API offline';
      }
    });
  }

  ngOnInit() {
  }
  showMessage(msg: ApiMessage) {
    this.statusBar = msg.Text;

    if (msg.Color && msg.BgColor) {
      this.style = { color: msg.Color, background: msg.BgColor };
      return;
    }

    switch (msg.Type) {
      case 'info':
        this.style = this.timelineStarted;
        break;
      case 'fail':
        this.style = this.timelineError;
        break;
      case 'success':
        this.style = this.timelineSuccess;
        break;
    }
  }
}