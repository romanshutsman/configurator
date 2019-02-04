import { Component, OnInit } from '@angular/core';

interface SignalR{
  notifyHub: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NewApp';



  public get connection() {
    return (<any>$).connection;
  }

  constructor() {

  }

  ngOnInit() {
   
    this.connection.hub.url = "http://localhost:13772/signalr";
    let conn = this.connection;

    if (conn.notifyHub)
    conn.notifyHub.client.ModeChangeMessage = (mode) => {
      console.log("Mode changed");
      console.log(mode);
    }

    this.connection.hub.start().done(function () { console.log("listening started") });
  }
}


