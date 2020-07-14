import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('item') item
  @Input('showActions') showActions:boolean
  constructor() { }
  ngOnInit(): void {
  }
  
}
