import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {


  @Input('message') message:string
  @Output() yes= new EventEmitter<void>()
  @Output() no= new EventEmitter<void>()
  constructor() { }

  ngOnInit() {
  }

  onYes () {
    this.yes.emit()
  }
  onNo () {
    this.no.emit()
  }


}
