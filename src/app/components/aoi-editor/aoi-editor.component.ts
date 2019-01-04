import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aoi-editor',
  templateUrl: './aoi-editor.component.html',
  styleUrls: ['./aoi-editor.component.scss']
})
export class AoiEditorComponent implements OnInit {
  aoi;
  @Input() set loadedAoi(value) {
    if(value) {
      this.aoi = value;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
